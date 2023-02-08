import React, { ReactElement, useMemo } from 'react'
import { Month } from './Month'
import { Day } from './Day'
import { Week } from './Week'
import { useSelector } from 'react-redux'
import { getDate, getInterval } from '@/redux/reducers/MainCalendarReducer'
import { CalendarInterval } from '@/constants/enums'
import { Category } from '@/types/Category'

interface MainCalendarProps {
  categories: Category[]
}

export const MainCalendar = (props: MainCalendarProps): ReactElement => {
  const activeCalView = useSelector(getInterval)
  const targetDate = useSelector(getDate)

  const calView = useMemo(() => {
    switch (activeCalView) {
      case CalendarInterval.DAY:
        return <Day date={targetDate} categories={props.categories} />
      case CalendarInterval.WEEK:
        return <Week firstDate={targetDate.startOf('week')} categories={props.categories} />
      default:
        return <Month targetDate={targetDate} categories={props.categories} />
    }
  }, [activeCalView, targetDate, props.categories])
  return <div className='flex grow flex-col bg-black'>{calView}</div>
}
