import React, { useCallback, useMemo } from 'react'
import { useAppSelector } from '@/redux/hooks'
import { getCategoryMap, getYear } from '@/redux/reducers/AppDataReducer'
import { getDate } from '@/redux/reducers/MainCalendarReducer'
import dayjs, { Dayjs } from 'dayjs'

export const Year = () => {
  const stateDate = useAppSelector(getDate)
  const categoryMap = useAppSelector(getCategoryMap)
  const entriesInYear = useAppSelector((state) => getYear(state, stateDate))

  const yearStartDate = dayjs(stateDate).startOf('year')
  const yearNum = yearStartDate.get('year')

  const renderDayCategories = useCallback(
    (day: Dayjs, monthNum: number) => {
      const entriesOnDay = entriesInYear?.[monthNum]?.[day.date()] ?? []
      const icons = entriesOnDay.map((calEvent, key) => {
        const category = categoryMap[calEvent.categoryId]
        if (category.show) {
          return (
            <span className={'pl-0.5 pr-0.5 font-bold'} key={`${calEvent.id}-${key}`}>
              <style jsx>{`
                * {
                  color: ${category.color};
                }
              `}</style>
              {category.icon}
            </span>
          )
        }
      })
      icons.push(<span key={`${monthNum}-${day.get('day')}`}>&nbsp;</span>)
      return icons
    },
    [categoryMap, entriesInYear]
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

      return <div className='box-border'>{days}</div>
    },
    [renderDay]
  )

  const renderDateNums = useMemo(() => {
    return Array.from(Array(32).keys()).map((dateNum) => {
      if (dateNum === 0)
        return (
          <div className={'sticky top-0 bg-slate-100 text-transparent'} key={dateNum}>
            .
          </div>
        )
      return (
        <div className={'pl-1 pr-1'} key={dateNum}>
          {dateNum}
        </div>
      )
    })
  }, [])

  const months = useMemo(() => {
    const twelveMonths = Array.from(Array(12).keys()).map((monthNum) => {
      const monthStartDate = dayjs(yearStartDate).add(monthNum, 'month')
      return (
        <div className='bg-white' key={`${yearNum}-${monthNum}`}>
          <h3 className='sticky top-0 bg-slate-100 text-center text-slate-400'>{monthStartDate.format('MMM')}</h3>
          {generateMonth(monthStartDate)}
        </div>
      )
    })
    return Array.from(Array(3).keys()).map((groupNum) => {
      return (
        <div className={'inline-flex w-full'} key={'group-' + groupNum}>
          <div className={'min-w-min bg-white'}>{renderDateNums}</div>
          <div className={'grid grow grid-cols-4 gap-0.5'}>
            {twelveMonths[groupNum * 4]}
            {twelveMonths[groupNum * 4 + 1]}
            {twelveMonths[groupNum * 4 + 2]}
            {twelveMonths[groupNum * 4 + 3]}
          </div>
        </div>
      )
    })
  }, [generateMonth, renderDateNums, yearNum, yearStartDate])

  return (
    <div className='grow bg-slate-200'>
      <div className={'box-border grid h-full grow grid-cols-3 gap-0.5'}>{months}</div>
    </div>
  )
}
