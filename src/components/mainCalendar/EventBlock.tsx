import React, { ReactElement } from 'react'
import { getTextColor } from '@/utils/color'
import { CalendarInterval } from '@/constants/enums'
import { useAppSelector } from '@/redux/hooks'
import { getInterval } from '@/redux/reducers/MainCalendarReducer'

interface EventBlockProps {
  color: string
  label: string
}

export const EventBlock = (props: EventBlockProps): ReactElement => {
  const activeCalView = useAppSelector(getInterval)
  return (
    <div className={`bg-[${props.color}] mt-1 ${getTextColor(props.color)} min-h-[1vh]`}>
      {activeCalView === CalendarInterval.MONTH ? props.label : ''}
    </div>
  )
}
