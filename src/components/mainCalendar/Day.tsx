import React, { ReactElement, useEffect, useMemo, useState } from 'react'
import { CalendarEvent, getEventsForDate } from '@/utils/calendar'
import { EventBlock } from './EventBlock'
import { Dayjs } from 'dayjs'

interface DayProps {
  date: Dayjs
}

/**
 * A day in month view.
 */
export const Day = (props: DayProps): ReactElement => {
  const [events, setEvents] = useState<CalendarEvent[]>([])

  useEffect(() => {
    setEvents(getEventsForDate(props.date))
  }, [props.date])

  const dayEvents = useMemo(() => {
    return events.map((calEvent, key) => <EventBlock color={calEvent.color} label={calEvent.title || ''} key={key} />)
  }, [events])

  return (
    <div className='tile overflow-y-auto bg-white'>
      <span>{props.date.date()}</span>
      {dayEvents}
    </div>
  )
}
