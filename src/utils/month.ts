/**
 * Reusable helper functions related to month calculations in the app
 */

import { CalendarInterval } from '@/constants/enums'
import { useCallback } from 'react'
import { Dayjs } from 'dayjs'

/**
 * Given the view that the user is on, return how many months are displayed in that view.
 *
 * @param interval - the type of view that the user is looking at
 */
export const intervalToNumMonths = (interval: CalendarInterval) => {
  switch (interval) {
    case CalendarInterval.YEAR:
    case CalendarInterval.YEAR_SCROLL:
      return 12
    case CalendarInterval.FOUR_MONTHS:
      return 4
    case CalendarInterval.QUARTERLY:
      return 3
    case CalendarInterval.MONTH:
      return 1
  }
}

/**
 * Return a function that generates the amount of work hours in a given month.
 */
export const useGetHoursInMonth = () => {
  return useCallback((dateInMonth: Dayjs) => {
    return ['January', 'May', 'August', 'October'].includes(dateInMonth.format('MMMM')) ? '200' : '160'
  }, [])
}
