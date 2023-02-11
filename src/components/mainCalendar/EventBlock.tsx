import React, { ReactElement } from 'react'
import { getTextColor } from '@/utils/color'
import { useAppSelector } from '@/redux/hooks'
import { isMonthInterval } from '@/redux/reducers/MainCalendarReducer'

interface EventBlockProps {
  color: string
  label: string
}

export const EventBlock = (props: EventBlockProps): ReactElement => {
  const monthView = useAppSelector(isMonthInterval)
  return (
    <div aria-label={props.label} className={`bg-[${props.color}] mt-1 ${getTextColor(props.color)} min-h-[1vh]`}>
      {monthView ? props.label : ''}
    </div>
  )
}
