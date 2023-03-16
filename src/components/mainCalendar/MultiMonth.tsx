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

  const quarterlyMonths = Array.from(Array(intervalToNumMonths(activeCalView)).keys()).map((monthNum) => {
    return (
      <div key={monthNum} className='flex flex-row items-center py-1'>
        <h3 className='w-1/6 pl-2 text-lg font-medium'>{dayjs(targetDate).add(monthNum, 'month').format('MMMM')}</h3>
        <Month className='h-full flex-grow' monthOffset={monthNum} key={monthNum}></Month>
      </div>
    )
  })

  const fourMonthMonths = Array.from(Array(intervalToNumMonths(activeCalView)).keys()).map((monthNum) => {
    return (
      <div key={monthNum}>
        <h3 className='pl-1'>{dayjs(targetDate).add(monthNum, 'month').format('MMMM')}</h3>
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
