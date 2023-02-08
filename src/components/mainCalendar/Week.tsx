import React, { ReactElement, useMemo } from 'react'
import { Day } from './Day'
import { Dayjs } from 'dayjs'
import { Category } from '@/utils/types'

interface WeekProps {
  firstDate: Dayjs
  categories: Category[]
  className?: string
}

export const Week = (props: WeekProps): ReactElement => {
  const generateDays = useMemo(() => {
    return Array.from(Array(7).keys()).map((dayNum) => {
      return <Day date={props.firstDate.add(dayNum, 'days')} key={dayNum} categories={props.categories} />
    })
  }, [props.firstDate, props.categories])
  return <div className={props.className + ' ' + 'grid grid-cols-7 gap-0.5'}>{generateDays}</div>
}
