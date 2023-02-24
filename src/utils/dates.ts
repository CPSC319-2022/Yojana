import * as parser from 'cron-parser'

export const generateDatesFromCron = (cron: any, start: string, end: string): string[] => {
  const dates = []
  try {
    const interval = parser.parseExpression(cron, { currentDate: start, endDate: end, iterator: true })

    while (true) {
      try {
        const date = interval.next().value.toDate()
        dates.push(date.toISOString())
      } catch (e) {
        break
      }
    }
  } catch (err) {
    console.error(err)
  }
  return dates
}
