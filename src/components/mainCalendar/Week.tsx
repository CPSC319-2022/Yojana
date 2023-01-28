import React, { ReactElement, useMemo } from 'react'
import { Day } from './Day'
import { Dayjs } from 'dayjs'

interface WeekProps {
  firstDate: Dayjs
}

export const Week = (props: WeekProps): ReactElement => {
  const generateDays = useMemo(() => {
    return Array.from(Array(7).keys()).map((dayNum) => {
      return <Day date={props.firstDate.add(dayNum, 'days')} key={dayNum} />
    })
  }, [props.firstDate])
  return <div className='week'>{generateDays}</div>
}
