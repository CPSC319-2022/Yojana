import { useAppSelector } from '@/redux/hooks'
import { getDate, getInterval, isQuarterlyInterval } from '@/redux/reducers/MainCalendarReducer'
import { intervalToNumMonths } from '@/utils/month'
import { Month } from '@/components/mainCalendar/Month'
import dayjs from 'dayjs'
import { getIsSelectingDates } from '@/redux/reducers/DateSelectorReducer'

export const MultiMonth = () => {
  const targetDate = useAppSelector(getDate)
  const activeCalView = useAppSelector(getInterval)
  const isQuarterlyView = useAppSelector(isQuarterlyInterval)
  const isSelectingDates = useAppSelector(getIsSelectingDates)

  const quarterlyMonths = Array.from(Array(intervalToNumMonths(activeCalView)).keys()).map((index) => {
    const monthOffset = index - (targetDate.month() % 3)
    const dateInMonth = dayjs(targetDate).add(monthOffset, 'month')
    return (
      <div key={index} className='flex flex-row items-center py-1'>
        <div className='flex w-1/6 flex-row pl-2 text-lg'>
          <h3 className='font-medium'>{dateInMonth.format('MM')}</h3>
          <h3 className='px-2'>•</h3>
          <h3>{dateInMonth.format('MMMM')}</h3>
        </div>
        <Month className='h-full w-5/6' monthOffset={monthOffset} key={monthOffset}></Month>
      </div>
    )
  })

  const fourMonthMonths = Array.from(Array(intervalToNumMonths(activeCalView)).keys()).map((monthNum) => {
    return (
      <div key={monthNum}>
        <h3 className='flex-grow pl-1'>
          {dayjs(targetDate).add(monthNum, 'month').format('MMMM')}
          <h4 className='inline-flex pl-1 text-sm text-gray-400'>
            {['January', 'May', 'August', 'October'].includes(dayjs(targetDate).add(monthNum, 'month').format('MMMM'))
              ? '200'
              : '160'}
          </h4>
        </h3>
        <Month className='h-[90%] flex-grow' monthOffset={monthNum} key={monthNum}></Month>
      </div>
    )
  })

  return (
    <div className='h-full w-full'>
      <div
        className={`box-border grid h-full gap-x-4 
        ${isSelectingDates ? 'divide-y' : ''}
        ${isQuarterlyView ? 'grid-cols-1 grid-rows-3' : 'grid-cols-2 grid-rows-2'}`}
      >
        {isQuarterlyView ? quarterlyMonths : fourMonthMonths}
      </div>
    </div>
  )
}
