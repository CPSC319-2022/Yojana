import { useAppSelector } from '@/redux/hooks'
import { getDate, getInterval, isYearInterval } from '@/redux/reducers/MainCalendarReducer'
import { convertToDurationKey } from '@/utils/month'
import { Month } from '@/components/mainCalendar/Month'
import dayjs from 'dayjs'

export const MultiMonth = () => {
  const activeCalView = useAppSelector(getInterval)
  const yearView = useAppSelector(isYearInterval)
  const targetDate = useAppSelector(getDate)
  const firstDate = yearView ? targetDate.startOf('year') : targetDate

  const months = Array.from(Array(convertToDurationKey(activeCalView)).keys()).map((monthNum) => {
    return (
      <div key={monthNum}>
        <h3 className='text-base'>{dayjs(firstDate).add(monthNum, 'month').format('MMMM')}</h3>
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
