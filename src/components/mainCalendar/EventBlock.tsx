import { useAppSelector } from '@/redux/hooks'
import { isMonthInterval } from '@/redux/reducers/MainCalendarReducer'
import { getTextColor } from '@/utils/color'
import { ReactElement } from 'react'

interface EventBlockProps {
  color: string
  label: string
  icon: string
}

export const EventBlock = (props: EventBlockProps): ReactElement => {
  const monthView = useAppSelector(isMonthInterval)
  const label = props.label.length > 18 ? props.label.substring(0, 18) + '...' : props.label
  return (
    <div
      aria-label={props.label}
      className={`bg-[${props.color}] mt-1 ${getTextColor(props.color)} max-h-[2.5vh] min-h-[1vh] pl-1 pr-1`}
    >
      {monthView ? props.icon + ' ' + label : ''}
    </div>
  )
}
