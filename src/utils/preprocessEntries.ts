import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import { Entry } from '@prisma/client'

// Set the UTC plugin for Day.js
dayjs.extend(utc)

// Set the timezone plugin for Day.js
dayjs.extend(timezone)

const getLocalDateWithoutTime = (date: Date, timezone = dayjs.tz.guess()) => {
  // Convert the input date to UTC and set the timezone
  const UTCDate = dayjs.utc(date).tz(timezone, true)

  // Calculate the timezone offset at the given date
  const timezoneOffset = UTCDate.utcOffset()

  // Calculate the local date without time using the UTC date and the timezone offset
  return UTCDate.utcOffset(timezoneOffset).startOf('day').toDate()
}

export const preprocessEntries = (entries: Entry[]) => {
  return entries.map((entry) => {
    return {
      ...entry,
      date: getLocalDateWithoutTime(entry.date)
    }
  })
}
