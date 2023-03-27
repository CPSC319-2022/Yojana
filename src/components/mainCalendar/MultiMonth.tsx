import { useAppSelector } from '@/redux/hooks'
import { getDate, getInterval, isQuarterlyInterval, isYearScrollInterval } from '@/redux/reducers/MainCalendarReducer'
import { intervalToNumMonths, useGetHoursInMonth } from '@/utils/month'
import { Month } from '@/components/mainCalendar/Month'
import dayjs from 'dayjs'
import { getIsSelectingDates } from '@/redux/reducers/DateSelectorReducer'
import { CalendarInterval } from '@/constants/enums'
import { useMemo } from 'react'

export const MultiMonth = () => {
  const targetDate = useAppSelector(getDate)
  const activeCalView = useAppSelector(getInterval)
  const isQuarterlyView = useAppSelector(isQuarterlyInterval)
  const isYearScrollView = useAppSelector(isYearScrollInterval)
  const isSelectingDates = useAppSelector(getIsSelectingDates)
  const getHoursInMonth = useGetHoursInMonth()

  const quarterlyMonths = Array.from(Array(intervalToNumMonths(activeCalView)).keys()).map((index) => {
    const monthOffset = index - (targetDate.month() % 3)
    const dateInMonth = dayjs(targetDate).add(monthOffset, 'month')
    const hoursInMonth = getHoursInMonth(dateInMonth)
    return (
      <div key={index} className='flex flex-row items-center py-1'>
        <div className='w-1/6 pl-2 text-lg'>
          <div className='flex flex-row'>
            <h3 className='font-medium'>{dateInMonth.format('MM')}</h3>
            <h3 className='px-2'>•</h3>
            <h3>{dateInMonth.format('MMMM')}</h3>
          </div>
          <div className='pt-1 text-sm text-slate-400'>{hoursInMonth} hrs</div>
        </div>
        <Month className='h-full w-5/6' monthOffset={monthOffset} key={monthOffset}></Month>
      </div>
    )
  })

  const twoByTwoMonths = Array.from(Array(intervalToNumMonths(activeCalView)).keys()).map((index) => {
    const monthOffset = index - targetDate.month()
    const dateInMonth = dayjs(targetDate).add(
      activeCalView === CalendarInterval.YEAR_SCROLL ? monthOffset : index,
      'month'
    )
    const hoursInMonth = getHoursInMonth(dateInMonth)
    return (
      <div key={index} className='h-full'>
        <h3 className='inline-flex flex-grow pl-1'>{dateInMonth.format('MMMM')}</h3>
        <h4 className='inline-flex pl-1 text-sm text-slate-400'>{hoursInMonth} hrs</h4>
        <Month className='h-[90%] flex-grow' monthOffset={index} key={index}></Month>
      </div>
    )
  })

  const viewClassNames = useMemo(() => {
    switch (activeCalView) {
      case CalendarInterval.FOUR_MONTHS:
        return 'grid-cols-2 grid-rows-2 h-full'
      case CalendarInterval.QUARTERLY:
        return 'grid-cols-1 grid-rows-3 h-full'
      case CalendarInterval.YEAR_SCROLL:
        return 'grid-cols-2 grid-rows-6 h-[270vh]'
    }
    return ''
  }, [activeCalView])

  return (
    <div className={`h-full w-full ${isYearScrollView ? 'overflow-y-scroll' : ''}`}>
      <div
        className={`box-border grid gap-x-4 overflow-y-hidden 
        ${isSelectingDates ? 'divide-y' : ''}
        ${viewClassNames}`}
      >
        {isQuarterlyView ? quarterlyMonths : twoByTwoMonths}
      </div>
    </div>
  )
}
