import React, { useCallback, useMemo } from 'react'
import { useAppSelector } from '@/redux/hooks'
import { getCategoriesOfYear } from '@/redux/reducers/AppDataReducer'
import { getDate } from '@/redux/reducers/MainCalendarReducer'
import { CategoryFullState } from '@/types/prisma'
import dayjs, { Dayjs } from 'dayjs'

export const Year = () => {
  const stateDate = useAppSelector(getDate)
  const yearStartDate = dayjs(stateDate).startOf('year')
  const yearNum = yearStartDate.get('year')

  const categoriesPerDate: CategoryFullState[][][] = useAppSelector((state) =>
    getCategoriesOfYear(state, yearStartDate)
  )

  const renderDayCategories = useCallback(
    (day: Dayjs, monthNum: number) => {
      if (monthNum < 0 || monthNum >= 12) return undefined
      return categoriesPerDate[monthNum][day.date() - 1]?.map((calEvent, key) => {
        if (calEvent.show) {
          return (
            <>
              <style jsx>{`
                span {
                  color: ${calEvent.color};
                }
              `}</style>
              <span key={key}>{calEvent.icon}</span>
            </>
          )
        }
      })
    },
    [categoriesPerDate]
  )

  const renderDay = useCallback(
    (monthStartDate: Dayjs, dateOffset: number, monthNum: number) => {
      const day = monthStartDate.add(dateOffset, 'days')
      const isSun = day.day() === 0
      const isSat = day.day() === 6

      return (
        <div
          className={'tile truncate pr-0.5 pl-0.5' + ' ' + (isSat || isSun ? 'bg-slate-100' : 'bg-white')}
          key={`${yearNum}-${monthNum}-${day.date()}`}
        >
          <span className={'mr-2'}>{day.date()}</span>
          {renderDayCategories(day, monthNum)}
        </div>
      )
    },
    [renderDayCategories, yearNum]
  )

  const generateMonth = useCallback(
    (monthStartDate: Dayjs) => {
      const daysInMonth = monthStartDate.daysInMonth()
      const monthNum = monthStartDate.get('month')

      const days = []

      for (let offset = 0; offset < daysInMonth; offset++) {
        days.push(renderDay(monthStartDate, offset, monthNum))
      }

      return <div className='box-border h-[90%]'>{days}</div>
    },
    [renderDay]
  )

  const months = useMemo(() => {
    return Array.from(Array(12).keys()).map((monthNum) => {
      const monthStartDate = dayjs(yearStartDate).add(monthNum, 'month')
      return (
        <div key={`${yearNum}-${monthNum}`}>
          <h3 className='bg-slate-100 text-center text-slate-400'>{monthStartDate.format('MMM')}</h3>
          {generateMonth(monthStartDate)}
        </div>
      )
    })
  }, [generateMonth, yearNum, yearStartDate])

  return (
    <div className='grow bg-slate-100'>
      <div className={'box-border grid h-full grow grid-cols-12 gap-0.5'}>{months}</div>
    </div>
  )
}
