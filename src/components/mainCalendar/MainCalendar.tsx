import React, { useMemo } from 'react'
import { Month } from './Month'
import { getInterval } from '@/redux/reducers/MainCalendarReducer'
import { CalendarInterval } from '@/constants/enums'
import { useAppSelector } from '@/redux/hooks'
import { MultiMonth } from '@/components/mainCalendar/MultiMonth'
import { Year } from '@/components/mainCalendar/Year'

/**
 * MainCalendar is responsible for rendering the calendar view according to the active calendar view.
 * The component uses the Redux hook useAppSelector to get the active calendar view from the MainCalendarReducer.
 * It utilizes useMemo to optimize rendering based on the active calendar view state change.
 *
 * The active calendar view can be one of the following:
 * 1. CalendarInterval.YEAR - Renders a Year view.
 * 2. CalendarInterval.YEAR_SCROLL - Renders a MultiMonth view with scrollability.
 * 3. CalendarInterval.FOUR_MONTHS - Renders a MultiMonth view with only four months.
 * 4. CalendarInterval.QUARTERLY - Renders a MultiMonth view for quarterly view.
 * 5. Otherwise - Renders a Month view.
 *
 * @returns {JSX.Element}
 */
export const MainCalendar = () => {
  const activeCalView = useAppSelector(getInterval)

  const calView = useMemo(() => {
    switch (activeCalView) {
      case CalendarInterval.YEAR:
        return <Year />
      case CalendarInterval.YEAR_SCROLL:
        return <MultiMonth />
      case CalendarInterval.FOUR_MONTHS:
        return <MultiMonth />
      case CalendarInterval.QUARTERLY:
        return <MultiMonth />
      default:
        return <Month monthOffset={0} />
    }
  }, [activeCalView])
  return <div className='flex grow flex-col overflow-y-hidden'>{calView}</div>
}
