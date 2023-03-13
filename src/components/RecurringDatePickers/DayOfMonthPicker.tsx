import React, { useEffect, useMemo, useState } from 'react'
import { useController } from 'react-hook-form'
import { Dropdown } from '@/components/common'
import { Dayjs } from 'dayjs'
import { DropdownMenuItem } from '@/components/common/Dropdown'

interface DayOfMonthPickerProps {
  control: any
  name: string
  rules?: any
  startDate: Dayjs
  selectedRecurrenceType: MonthRecurrenceType
  setSelectedRecurrenceType: React.Dispatch<React.SetStateAction<MonthRecurrenceType>>
  updateState?: (cron: string) => void
}

export enum MonthRecurrence {
  NONE = 'NONE',
  ON_DATE_Y = 'ON_DATE_Y',
  ON_LAST_DAY = 'ON_LAST_DAY',
  ON_YTH_XDAY = 'ON_YTH_XDAY',
  ON_LAST_XDAY = 'ON_LAST_XDAY'
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
  const [recurrenceType, setRecurrenceType] = useState(selectedRecurrenceType)

  useEffect(() => {
    setDateOfMonth(startDate.date())
    setWeekNum(Math.ceil(startDate.date() / 7))
    setDayOfWeek(startDate.day())
  }, [startDate])

  useEffect(() => {
    const cronString = monthRecurrenceCrons[recurrenceType]
      .replace(weekNumReplacer, weekNum.toString())
      .replace(dayOfWeekReplacer, dayOfWeek.toString())
      .replace(dateOfMonthReplacer, dateOfMonth.toString())

    onChange(cronString)
    updateState(cronString)
    setSelectedRecurrenceType(recurrenceType)
  }, [recurrenceType, dateOfMonth, dayOfWeek, onChange, setSelectedRecurrenceType, updateState, weekNum])

  const availableMenuItems: { [key in MonthRecurrenceType]: DropdownMenuItem } = useMemo(() => {
    return {
      NONE: { key: MonthRecurrence.NONE, label: 'None', onClick: () => setRecurrenceType(MonthRecurrence.NONE) },
      ON_DATE_Y: {
        key: MonthRecurrence.ON_DATE_Y,
        label: `Monthly on day ${dateOfMonth}`,
        onClick: () => setRecurrenceType(MonthRecurrence.ON_DATE_Y)
      },
      ON_LAST_DAY: {
        key: MonthRecurrence.ON_LAST_DAY,
        label: `Monthly on last day of month`,
        onClick: () => setRecurrenceType(MonthRecurrence.ON_LAST_DAY)
      },
      ON_YTH_XDAY: {
        key: MonthRecurrence.ON_YTH_XDAY,
        label: `Monthly on the ${ordinals[weekNum - 1]} ${startDate.format('dddd')}`,
        onClick: () => setRecurrenceType(MonthRecurrence.ON_YTH_XDAY)
      },
      ON_LAST_XDAY: {
        key: MonthRecurrence.ON_LAST_XDAY,
        label: `Monthly on the last ${startDate.format('dddd')}`,
        onClick: () => setRecurrenceType(MonthRecurrence.ON_LAST_XDAY)
      }
    }
  }, [dateOfMonth, startDate, weekNum])

  const getMenuItems = useMemo(() => {
    const menuItems: DropdownMenuItem[] = [availableMenuItems[MonthRecurrence.NONE]]

    if (dateOfMonth <= 28) menuItems.push(availableMenuItems[MonthRecurrence.ON_DATE_Y])
    if (dateOfMonth === startDate.daysInMonth()) menuItems.push(availableMenuItems[MonthRecurrence.ON_LAST_DAY])
    if (weekNum <= 4) menuItems.push(availableMenuItems[MonthRecurrence.ON_YTH_XDAY])
    if (dateOfMonth > startDate.daysInMonth() - 7) menuItems.push(availableMenuItems[MonthRecurrence.ON_LAST_XDAY])

    return menuItems
  }, [availableMenuItems, dateOfMonth, startDate, weekNum])

  return (
    <div className='flex flex-wrap justify-center pt-3'>
      <Dropdown text={availableMenuItems[selectedRecurrenceType].label} menuItems={getMenuItems} isLarge={true} />
    </div>
  )
}
