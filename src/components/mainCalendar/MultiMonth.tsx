import { useAppSelector } from '@/redux/hooks'
import { getDate, getInterval } from '@/redux/reducers/MainCalendarReducer'
import { convertToNumMonths } from '@/utils/month'
import { Month } from '@/components/mainCalendar/Month'
import dayjs from 'dayjs'

export const MultiMonth = () => {
  const activeCalView = useAppSelector(getInterval)
  const targetDate = useAppSelector(getDate)

  const months = Array.from(Array(convertToNumMonths(activeCalView)).keys()).map((monthNum) => {
    return (
      <div key={monthNum}>
        <h3 className='text-base'>{dayjs(targetDate).add(monthNum, 'month').format('MMMM')}</h3>
        <Month className='h-[38vh]' monthOffset={monthNum} key={monthNum}></Month>
      </div>
    )
  })

  return (
    <div className='grow'>
      <div className={'box-border grid h-full grow grid-cols-2 gap-4'}>{months}</div>
    </div>
  )
}
