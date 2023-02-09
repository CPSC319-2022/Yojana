import { CalendarInterval } from '@/constants/enums'

export const convertToDurationKey = (interval: CalendarInterval) => {
  switch (interval) {
    case CalendarInterval.YEAR:
      return 12
    case CalendarInterval.FOUR_MONTHS:
      return 4
    case CalendarInterval.MONTH:
      return 1
  }
}
