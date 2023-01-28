import { Dayjs } from 'dayjs'

/**
 * An event in a calendar. Actually not sure what this should be...
 * categoryName - name of category
 * startDate - start date of cron expression
 * endDate - in case they want an end date
 * cronExpression - to get next event
 * title - if specific event has a title
 */
export interface CalendarEvent {
  categoryName: string
  color: string
  endDate: string
  startDate: string
  title?: string
}

// TODO this is a mock function
export const getEventsForDate = (date: Dayjs): CalendarEvent[] => {
  const mondayEvent = {
    categoryName: 'test',
    color: 'ice-blue',
    endDate: 'temp',
    startDate: 'temp',
    title: 'My Monday Event'
  }

  const firstEvent = {
    categoryName: 'test',
    color: 'ice-blue',
    endDate: 'temp',
    startDate: 'temp',
    title: 'My First Day of Month Event'
  }

  const monWedEvent = {
    categoryName: '319 Course',
    color: 'pale-silver',
    endDate: '2023-04-13',
    startDate: '2023-01-09',
    title: '319 Day'
  }

  const eventsList = []

  if (date.date() === 1) {
    eventsList.push(firstEvent)
  }
  if (date.day() === 1) {
    eventsList.push(mondayEvent)
    eventsList.push(monWedEvent)
  } else if (date.day() === 3) {
    eventsList.push(monWedEvent)
  }

  return eventsList
}
