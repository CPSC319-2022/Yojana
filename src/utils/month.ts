import { CalendarInterval } from '@/constants/enums'

export const intervalToNumMonths = (interval: CalendarInterval) => {
  switch (interval) {
    case CalendarInterval.YEAR:
      return 12
    case CalendarInterval.FOUR_MONTHS:
      return 4
    case CalendarInterval.QUARTERLY:
      return 3
    case CalendarInterval.MONTH:
      return 1
  }
}
