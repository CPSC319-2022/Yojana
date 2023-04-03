/**
 * Configuration and helper functions used to preprocessing dates to be in the right format for the webapp.
 */

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

/**
 * Return a JavaScript native date, without any associated time
 *
 * @param date - JS date object that may have an associated time
 */
export const getLocalDateWithoutTime = (date: Date) => {
  return dayjs.utc(date).tz().startOf('day').toDate()
}

/**
 * Given a list of entries corresponding to various categories' occurrences,
 * remove their dates' associated timezones.
 *
 * @param entries - a list of entries, where each represents a single instance of a category's occurence
 */
export const preprocessEntries = (entries: Entry[]) => {
  return entries.map((entry) => {
    return {
      ...entry,
      date: getLocalDateWithoutTime(entry.date)
    }
  })
}
