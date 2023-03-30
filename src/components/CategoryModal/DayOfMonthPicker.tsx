import { Dayjs } from 'dayjs'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useController } from 'react-hook-form'
import { useAppSelector } from '@/redux/hooks'
import { getIsSelectingDates } from '@/redux/reducers/DateSelectorReducer'

interface DayOfMonthPickerProps {
  control: any
  name: string
  rules?: any
  startDate: Dayjs
  selectedRecurrenceType: MonthRecurrenceType | null
  setSelectedRecurrenceType: React.Dispatch<React.SetStateAction<MonthRecurrenceType | null>>
  updateState?: (cron: string) => void
}

export enum MonthRecurrence {
  NONE = 'NONE',
  ON_DATE_Y = 'ON_DATE_Y', // E.g. "Monthly on day 1"
  ON_LAST_DAY = 'ON_LAST_DAY', // E.g. "Monthly on the last day"
  ON_YTH_XDAY = 'ON_YTH_XDAY', // E.g. "Monthly on the fourth Sunday"
  ON_LAST_XDAY = 'ON_LAST_XDAY' // E.g. "Monthly on the last Sunday"
}
export type MonthRecurrenceType = keyof typeof MonthRecurrence

// Note: weekNum is defined as ceil(day.date() / 7). So the 7th is always weekNum = 1.
const weekNumReplacer = '{weekNum}'
const dayOfWeekReplacer = '{dayOfWeek}'
const dateOfMonthReplacer = '{dateOfMonth}'
export const monthRecurrenceCrons: { [key in MonthRecurrenceType]: string } = {
  NONE: '',
  ON_DATE_Y: `0 0 ${dateOfMonthReplacer} * *`,
  ON_LAST_DAY: `0 0 L * ?`,
  ON_YTH_XDAY: `0 0 ? * ${dayOfWeekReplacer}#${weekNumReplacer}`,
  ON_LAST_XDAY: `0 0 ? * ${dayOfWeekReplacer}L`
}

const ordinals = ['first', 'second', 'third', 'fourth']

export const DayOfMonthPicker = ({
  control,
  name,
  rules,
  startDate,
  selectedRecurrenceType,
  setSelectedRecurrenceType,
  updateState = () => {}
}: DayOfMonthPickerProps) => {
  const {
    field: { onChange }
  } = useController({
    name: name,
    control: control,
    rules: rules
  })

  const [dateOfMonth, setDateOfMonth] = useState(startDate.date())
  const [weekNum, setWeekNum] = useState(Math.ceil(startDate.date() / 7))
  const [dayOfWeek, setDayOfWeek] = useState(startDate.day())
  const [recurrenceType, setRecurrenceType] = useState<MonthRecurrenceType | null>(selectedRecurrenceType)
  const isSelectingDates = useAppSelector(getIsSelectingDates)

  useEffect(() => {
    setDateOfMonth(startDate.date())
    setWeekNum(Math.ceil(startDate.date() / 7))
    setDayOfWeek(startDate.day())
  }, [startDate])

  const handleRecurrenceChange = useCallback(
    (newType: MonthRecurrenceType | null) => {
      const cronString =
        newType === null
          ? ''
          : monthRecurrenceCrons[newType]
              .replace(weekNumReplacer, weekNum.toString())
              .replace(dayOfWeekReplacer, dayOfWeek.toString())
              .replace(dateOfMonthReplacer, dateOfMonth.toString())

      if (newType !== null) {
        onChange(cronString)
        updateState(cronString)
        setRecurrenceType(newType)
        setSelectedRecurrenceType(newType)
      }
    },
    [dateOfMonth, dayOfWeek, onChange, setSelectedRecurrenceType, updateState, weekNum]
  )

  useEffect(() => {
    handleRecurrenceChange(recurrenceType)
  }, [startDate, handleRecurrenceChange, recurrenceType])

  // This needs to be a callback instead of a useMemo because deps updated in a chain causes flashing.
  const unfilteredMenuItems = useCallback(
    (weekNum: number, startDate: Dayjs) => {
      return {
        NONE: {
          id: 'recurring-monthly-no-day',
          key: MonthRecurrence.NONE,
          label: 'None',
          onClick: () => handleRecurrenceChange(MonthRecurrence.NONE)
        },
        ON_DATE_Y: {
          id: 'recurring-monthly-some-day',
          key: MonthRecurrence.ON_DATE_Y,
          label: `Monthly on day ${startDate.date()}`,
          onClick: () => handleRecurrenceChange(MonthRecurrence.ON_DATE_Y)
        },
        ON_LAST_DAY: {
          id: 'recurring-monthly-last-day',
          key: MonthRecurrence.ON_LAST_DAY,
          label: `Monthly on the last day`,
          onClick: () => handleRecurrenceChange(MonthRecurrence.ON_LAST_DAY)
        },
        ON_YTH_XDAY: {
          id: 'recurring-monthly-someX-day',
          key: MonthRecurrence.ON_YTH_XDAY,
          label: `Monthly on the ${ordinals[weekNum - 1]} ${startDate.format('dddd')}`,
          onClick: () => handleRecurrenceChange(MonthRecurrence.ON_YTH_XDAY)
        },
        ON_LAST_XDAY: {
          id: 'recurring-monthly-lastX-day',
          key: MonthRecurrence.ON_LAST_XDAY,
          label: `Monthly on the last ${startDate.format('dddd')}`,
          onClick: () => handleRecurrenceChange(MonthRecurrence.ON_LAST_XDAY)
        }
      }
    },
    [handleRecurrenceChange]
  )

  const getMenuItems = useMemo(() => {
    // Calculate weekNum internally to reduce flashing
    const weekNum = Math.ceil(startDate.date() / 7)

    const includeItems = [MonthRecurrence.NONE]
    if (!isNaN(dateOfMonth)) includeItems.push(MonthRecurrence.ON_DATE_Y)
    if (dateOfMonth === startDate.daysInMonth()) includeItems.push(MonthRecurrence.ON_LAST_DAY)
    if (weekNum <= 4) includeItems.push(MonthRecurrence.ON_YTH_XDAY)
    if (dateOfMonth > startDate.daysInMonth() - 7) includeItems.push(MonthRecurrence.ON_LAST_XDAY)

    if (recurrenceType !== null && !includeItems.includes(MonthRecurrence[recurrenceType]))
      setRecurrenceType(MonthRecurrence.NONE)

    const menuItems = unfilteredMenuItems(weekNum, startDate)
    return includeItems.map((item) => menuItems[item])
  }, [unfilteredMenuItems, dateOfMonth, recurrenceType, startDate])

  return (
    <div
      className={`mx-4 mt-3 flex grid flex-wrap justify-center pt-3 
      ${isSelectingDates ? 'grid-cols-1 gap-1' : 'grid-cols-2  gap-3'}`}
    >
      {getMenuItems.map((item) => {
        const isActive = recurrenceType === item.key || (recurrenceType === null && item.key === MonthRecurrence.NONE)
        return (
          <button
            id={item.id}
            key={item.key}
            type='button'
            onClick={item.onClick}
            className={`group flex w-full rounded-md px-4 py-2 text-left
            ${isActive ? 'bg-emerald-100 hover:bg-emerald-200' : 'bg-slate-100 hover:bg-slate-200'}`}
          >
            {item.label}
          </button>
        )
      })}
    </div>
  )
}
