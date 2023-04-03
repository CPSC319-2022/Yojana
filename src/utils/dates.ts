/**
 * Reusable helper functions related to dates in the app
 */

import * as parser from 'cron-parser'

/**
 * Given a cron string, generate the date objects associated with it.
 *
 * @param cron - the target cron string
 * @param start - the first date with recurring event
 * @param end - the last date (inclusive) that may have the recurring event.
 */
export const generateDatesFromCron = (
  cron: string | undefined,
  start: string,
  end: string
): { date: string; isRecurring: boolean }[] => {
  if (!cron) return []
  const dates = []
  try {
    // set the currentDate option to the start date minus one millisecond. This will ensure that the first date generated is on or after the start date.
    const interval = parser.parseExpression(cron, {
      currentDate: new Date(new Date(start).getTime() - 1),
      endDate: end,
      iterator: true
    })

    while (true) {
      try {
        dates.push({
          date: interval.next().value.toDate().toISOString(),
          isRecurring: true
        })
      } catch (e) {
        break
      }
    }
  } catch (err) {
    console.error(err)
  }
  return dates
}
