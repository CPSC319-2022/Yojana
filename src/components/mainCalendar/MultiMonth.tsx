import { useAppSelector } from '@/redux/hooks'
import { getInterval } from '@/redux/reducers/MainCalendarReducer'
import { convertToDurationKey } from '@/utils/month'
import { Month } from '@/components/mainCalendar/Month'

export const MultiMonth = () => {
  const activeCalView = useAppSelector(getInterval)

  const months = Array.from(Array(convertToDurationKey(activeCalView)).keys()).map((monthNum) => {
    return <Month monthOffset={monthNum - 1} key={monthNum} className='h-[43vh]'></Month>
  })

  return (
    <div className='grow'>
      <div className={'box-border grid grid-cols-2 gap-2 overflow-y-auto'}>{months}</div>
    </div>
  )
}
