import React, { ReactElement } from 'react'
import { getTextColor } from '@/utils/color'
import { CalendarInterval } from '@/constants/enums'
import { useAppSelector } from '@/redux/hooks'
import { getInterval } from '@/redux/reducers/MainCalendarReducer'

interface EventBlockProps {
  icon?: string
  color: string
  label: string
}

export const EventBlock = ({ color, label, icon = '' }: EventBlockProps): ReactElement => {
  const activeCalView = useAppSelector(getInterval)
  return (
    <div className={`bg-[${color}] mt-1 ${getTextColor(color)} min-h-[1vh]`}>
      <span className='ml-1'>{activeCalView === CalendarInterval.MONTH ? `${icon} ${label}` : ''}</span>
    </div>
  )
}
