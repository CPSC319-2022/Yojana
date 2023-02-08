import React, { ReactElement, useMemo } from 'react'
import { EventBlock } from './EventBlock'
import { Dayjs } from 'dayjs'
import { useSelector } from 'react-redux'
import { getCategoriesOnDate } from '@/redux/reducers/AppDataReducer'

interface DayProps {
  date: Dayjs
}

/**
 * A day in month view.
 */
export const Day = (props: DayProps): ReactElement => {
  const categories = useSelector((state: any) => getCategoriesOnDate(state, props.date))

  const dayEvents = useMemo(() => {
    return categories.map((calEvent, key) => (
      <EventBlock color={calEvent.color} label={calEvent.name || ''} key={key} />
    ))
  }, [categories])

  return (
    <div className='tile overflow-y-auto bg-white'>
      <span>{props.date.date()}</span>
      {dayEvents}
    </div>
  )
}
