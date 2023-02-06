import React, { ReactElement, useEffect, useMemo, useState } from 'react'

import { Week } from './Week'
import { Dayjs } from 'dayjs'

/**
 * month - number from 1 to 12... denoting month of the year...
 */
interface MonthProps {
  targetDate: Dayjs
}

export const Month = (props: MonthProps): ReactElement => {
  const [daysInMonth, setDaysInMonth] = useState<number>()
  const [monthStart, setMonthStart] = useState<Dayjs>()
  useEffect(() => {
    setDaysInMonth(props.targetDate.daysInMonth())
    setMonthStart(props.targetDate.startOf('month'))
  }, [props.targetDate])

  const generateWeeks = useMemo(() => {
    if (daysInMonth !== undefined && monthStart !== undefined) {
      const weeks: ReactElement[] = []
      const numWeeks = Math.ceil((daysInMonth + monthStart.day()) / 7)
      for (let i = 0 - monthStart.day(); i < daysInMonth; i += 7) {
        weeks.push(<Week className={`h-1/${numWeeks} pt-0.5`} firstDate={monthStart.add(i, 'days')} key={i} />)
      }
      return weeks
    }
    return <></>
  }, [daysInMonth, monthStart])

  return <div className='grow'>{generateWeeks}</div>
}
