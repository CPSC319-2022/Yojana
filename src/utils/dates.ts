import * as parser from 'cron-parser'

export const generateDatesFromCron = (
  cron: string | undefined,
  start: string,
  end: string
): { date: string; isRepeating: boolean }[] => {
  if (!cron) return []
  const dates = []
  try {
    const interval = parser.parseExpression(cron, { currentDate: start, endDate: end, iterator: true })

    while (true) {
      try {
        dates.push({
          date: interval.next().value.toDate().toISOString(),
          isRepeating: true
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
