import { CalendarInterval } from '@/constants/enums'
import { useCallback } from 'react'
import { Dayjs } from 'dayjs'

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

export const useGetHoursInMonth = () => {
  return useCallback((dateInMonth: Dayjs) => {
    return ['January', 'May', 'August', 'October'].includes(dateInMonth.format('MMMM')) ? '200' : '160'
  }, [])
}
