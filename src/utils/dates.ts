import * as parser from 'cron-parser'

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
