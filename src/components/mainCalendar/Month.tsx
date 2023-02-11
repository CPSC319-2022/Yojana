import React, { ReactElement, useCallback } from 'react'

import { useAppSelector } from '@/redux/hooks'
import { getDate, isMonthInterval, isYearInterval } from '@/redux/reducers/MainCalendarReducer'
import { getCategoriesOfMonth } from '@/redux/reducers/AppDataReducer'
import { EventBlock } from '@/components/mainCalendar/EventBlock'
import { AppData } from '@/types/AppData'
import dayjs from 'dayjs'

interface MonthProps {
  monthOffset: number
  className?: string
}
export const Month = (props: MonthProps): ReactElement => {
  const monthView = useAppSelector(isMonthInterval)
  const stateDate = useAppSelector(getDate)
  const referenceDate = useAppSelector(isYearInterval) ? dayjs().startOf('year') : stateDate
  const targetDate = referenceDate.add(props.monthOffset, 'month')
  const monthStartDate = targetDate.startOf('month')
  const daysInMonth = targetDate.daysInMonth()
  const numWeeks = Math.ceil((daysInMonth + monthStartDate.day()) / 7)

  const categoriesPerDate: AppData[][] = useAppSelector((state) => getCategoriesOfMonth(state, targetDate))

  // this thing needs to work by offset
  const renderDay = useCallback(
    (firstDateOfWeek: number, dayNum: number) => {
      const offsetFromMonthStart = firstDateOfWeek + dayNum
      const day = monthStartDate.add(offsetFromMonthStart, 'days')
      const dayCategories = categoriesPerDate[day.date() - 1]?.map((calEvent, key) => (
        <EventBlock color={calEvent.color} label={calEvent.name || ''} icon={calEvent.icon} key={key} />
      ))
      return (
        <div className={`tile overflow-y-auto bg-white`} key={day.date()}>
          <span
            className={`${offsetFromMonthStart < 0 || offsetFromMonthStart >= daysInMonth ? 'text-slate-400' : ''}`}
          >
            {day.date()}
          </span>
          {dayCategories}
        </div>
      )
    },
    [categoriesPerDate, daysInMonth, monthStartDate]
  )

  // monthOffset is the offset of the Sunday from the beginning of the month.
  const renderWeek = useCallback(
    (firstDateOfWeek: number) => {
      const generatedDays = Array.from(Array(7).keys()).map((dayNum) => {
        return renderDay(firstDateOfWeek, dayNum)
      })
      return (
        <div className={`h-1/${numWeeks} grid grid-cols-7 gap-0.5 pt-0.5`} key={firstDateOfWeek}>
          {generatedDays}
        </div>
      )
    },
    [numWeeks, renderDay]
  )

  const generateWeeks = useCallback(() => {
    const weeks: ReactElement[] = []
    for (let i = 0 - monthStartDate.day(); i < daysInMonth; i += 7) {
      weeks.push(renderWeek(i))
    }
    return <div className={`h-[${monthView ? '95%' : '90%'}]`}>{weeks}</div>
  }, [daysInMonth, monthStartDate, monthView, renderWeek])

  const generateDayNames = useCallback(() => {
    return (
      <div className='grid grid-cols-7'>
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((letter, index) => (
          <span className='tile text-m text-slate-400' key={index}>
            {letter}
          </span>
        ))}
      </div>
    )
  }, [])

  return (
    <div className={props.className + ' ' + 'box-border bg-slate-200' + ' ' + (monthView ? 'h-full' : '')}>
      {generateDayNames()}
      {generateWeeks()}
    </div>
  )
}
