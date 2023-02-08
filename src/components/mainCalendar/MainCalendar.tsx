import React, { ReactElement, useMemo } from 'react'
import { Month } from './Month'
import { Day } from './Day'
import { Week } from './Week'
import { useSelector } from 'react-redux'
import { getDate, getInterval } from '@/redux/reducers/MainCalendarReducer'
import { CalendarInterval } from '@/constants/enums'

export const MainCalendar = (): ReactElement => {
  const activeCalView = useSelector(getInterval)
  const targetDate = useSelector(getDate)

  const calView = useMemo(() => {
    switch (activeCalView) {
      case CalendarInterval.DAY:
        return <Day date={targetDate} />
      case CalendarInterval.WEEK:
        return <Week firstDate={targetDate.startOf('week')} />
      default:
        return <Month targetDate={targetDate} />
    }
  }, [activeCalView, targetDate])
  return <div className='flex grow flex-col bg-black'>{calView}</div>
}
