import React, { useMemo } from 'react'
import { Month } from './Month'
import { getInterval } from '@/redux/reducers/MainCalendarReducer'
import { CalendarInterval } from '@/constants/enums'
import { useAppSelector } from '@/redux/hooks'
import { MultiMonth } from '@/components/mainCalendar/MultiMonth'

export const MainCalendar = () => {
  const activeCalView = useAppSelector(getInterval)

  const calView = useMemo(() => {
    switch (activeCalView) {
      case CalendarInterval.YEAR:
        return <MultiMonth />
      case CalendarInterval.FOUR_MONTHS:
        return <MultiMonth />
      default:
        return <Month monthOffset={0} />
    }
  }, [activeCalView])
  return <div className='flex grow flex-col overflow-y-auto bg-white'>{calView}</div>
}
