import React, { ReactElement, useEffect, useMemo, useState } from 'react'
import styles from './MainCalendar.module.scss'

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

  const generateWeek = useMemo(() => {
    if (daysInMonth !== undefined && monthStart !== undefined) {
      const weeks: ReactElement[] = []
      for (let i = 0 - monthStart.day(); i < daysInMonth; i += 7) {
        weeks.push(<Week firstDate={monthStart.add(i, 'days')} key={i} />)
      }
      return weeks
    }
    return <></>
  }, [daysInMonth, monthStart])

  return <div className={styles.month}>{generateWeek}</div>
}
