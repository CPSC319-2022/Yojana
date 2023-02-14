import { useAppSelector } from '@/redux/hooks'
import { isMonthInterval } from '@/redux/reducers/MainCalendarReducer'
import { getTextColor } from '@/utils/color'

interface EventBlockProps {
  color: string
  label: string
  icon: string
}

export const EventBlock = (props: EventBlockProps) => {
  const monthView = useAppSelector(isMonthInterval)
  return (
    <div
      aria-label={props.label}
      className={`bg-[${props.color}] mt-1 ${getTextColor(
        props.color
      )} mx-1 min-h-[1vh] overflow-x-hidden whitespace-nowrap rounded-md px-1.5`}
    >
      {monthView ? props.icon + ' ' + props.label : ''}
    </div>
  )
}
