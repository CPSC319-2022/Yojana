import React, { ReactElement, useEffect, useMemo, useState } from 'react'

import { Week } from './Week'
import { Dayjs } from 'dayjs'
import { Category } from '@/types/Category'

/**
 * month - number from 1 to 12... denoting month of the year...
 */
interface MonthProps {
  categories: Category[]
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
        weeks.push(
          <Week
            className={`h-1/${numWeeks} pt-0.5`}
            firstDate={monthStart.add(i, 'days')}
            key={i}
            categories={props.categories}
          />
        )
      }
      return weeks
    }
    return <></>
  }, [daysInMonth, monthStart, props.categories])

  return <div className='grow'>{generateWeeks}</div>
}
