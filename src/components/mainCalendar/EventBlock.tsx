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
  return (
    <div
      aria-label={props.label}
      className={`bg-[${props.color}] mt-1 ${getTextColor(
        props.color
      )} min-h-[1vh] overflow-x-hidden whitespace-nowrap rounded-md pl-1 pr-1`}
    >
      {monthView ? props.icon + ' ' + props.label : ''}
    </div>
  )
}
