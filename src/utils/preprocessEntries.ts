import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import { Entry } from '@prisma/client'

// Set the UTC plugin for Day.js
dayjs.extend(utc)

// Set the timezone plugin for Day.js
dayjs.extend(timezone)

// Set the default timezone to Vancouver
dayjs.tz.setDefault('America/Vancouver')

// Set the process timezone to UTC
process.env.TZ = 'UTC'

const getLocalDateWithoutTime = (date: Date) => {
  return dayjs.utc(date).tz().startOf('day').toDate()
}

export const preprocessEntries = (entries: Entry[]) => {
  return entries.map((entry) => {
    return {
      ...entry,
      date: getLocalDateWithoutTime(entry.date)
    }
  })
}
