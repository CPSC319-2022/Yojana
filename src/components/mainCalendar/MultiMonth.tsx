import { Month } from '@/components/mainCalendar/Month'
import { CalendarInterval } from '@/constants/enums'
import { useAppSelector } from '@/redux/hooks'
import { getIsSelectingDates } from '@/redux/reducers/DateSelectorReducer'
import {
  getDate,
  getInterval,
  isFourMonthInterval,
  isMonthInterval,
  isQuarterlyInterval,
  isYearInterval,
  isYearScrollInterval
} from '@/redux/reducers/MainCalendarReducer'
import { intervalToNumMonths, useGetHoursInMonth } from '@/utils/month'
import dayjs from 'dayjs'
import { useMemo } from 'react'
/**
 * MultiMonth is responsible for rendering multiple Month(s) based on the selected calendar interval.
 * It leverages the dayjs library, various hooks, and the Month component to display the months in a grid format.
 * Key functionalities:
 * Different grid formats for printing and various calendar intervals.
 * Calculation of hours in each month using the useGetHoursInMonth custom hook.
 * Rendering of Month components with the appropriate monthOffset.
 * Conditionally displaying the hours for each month.
 *
 * @param {boolean} [getForPrinting] - Optional flag indicating if the MultiMonth is for printing.
 * @returns {JSX.Element}
 */
export const MultiMonth = ({ getForPrinting = false }: { getForPrinting?: boolean }) => {
  const targetDate = useAppSelector(getDate)
  const activeCalView = useAppSelector(getInterval)
  const isYearView = useAppSelector(isYearInterval)
  const isMonthView = useAppSelector(isMonthInterval)
  const isQuarterlyView = useAppSelector(isQuarterlyInterval)
  const isFourMonthView = useAppSelector(isFourMonthInterval)
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
        <Month
          className='h-[90%] flex-grow'
          monthOffset={isYearScrollView ? monthOffset : index}
          key={isYearScrollView ? monthOffset : index}
        />
      </div>
    )
  })

  const twoByTwoMonthsForPrint = Array.from(Array(intervalToNumMonths(CalendarInterval.YEAR_SCROLL)).keys()).map(
    (index) => {
      const monthOffset = index - targetDate.month()
      const offset = isMonthView || isQuarterlyView || isFourMonthView || isYearScrollView ? monthOffset : index

      const dateInMonth = dayjs(targetDate).add(isYearView ? monthOffset : offset, 'month')
      const hoursInMonth = getHoursInMonth(dateInMonth)

      return (
        <div key={index} className={`h-full break-inside-avoid`} id={'year-scroll-view'}>
          <h3 className='inline-flex flex-grow pl-1'>{dateInMonth.format('MMMM')}</h3>
          <h4 className='inline-flex pl-1 text-sm text-slate-400'>{hoursInMonth} hrs</h4>
          <Month className='h-[90%] flex-grow' monthOffset={offset} key={offset} getForPrinting={getForPrinting} />
        </div>
      )
    }
  )

  const viewClassNames = useMemo(() => {
    if (getForPrinting) return 'grid-cols-2 grid-rows-6 h-[300]'
    switch (activeCalView) {
      case CalendarInterval.FOUR_MONTHS:
        return 'grid-cols-2 grid-rows-2 h-full'
      case CalendarInterval.QUARTERLY:
        return 'grid-cols-1 grid-rows-3 h-full'
      case CalendarInterval.YEAR_SCROLL:
        return 'grid-cols-1 grid-rows-12 h-[540vh] lg:grid-cols-2 lg:grid-rows-6 lg:h-[270vh]'
    }
  }, [activeCalView, getForPrinting])

  return (
    <div
      className={`h-full w-full ${getForPrinting ? 'overflow-y-visible' : isYearScrollView ? 'overflow-y-scroll' : ''}`}
      id={'year-scroll-view'}
    >
      <div
        className={`box-border grid gap-x-4 
        ${getForPrinting ? 'overflow-y-visible' : 'overflow-y-hidden '}
        ${isSelectingDates ? 'divide-y' : ''}
        ${viewClassNames}`}
      >
        {getForPrinting && twoByTwoMonthsForPrint}
        {!getForPrinting && (isQuarterlyView ? quarterlyMonths : twoByTwoMonths)}
      </div>
    </div>
  )
}
