import React from 'react'
import { getInterval, setInterval } from '@/redux/reducers/MainCalendarReducer'
import { CalendarInterval } from '@/constants/enums'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { Dropdown } from '@/components/common'

/*
 * This component provides functionality to change between different calendar views: Month, quarterly, four months,
 * year(scroll), and year
 */

export const CalViewDropdown = () => {
  const dispatch = useAppDispatch()
  const activeCalView = useAppSelector(getInterval)

  return (
    <Dropdown text={activeCalView} containerClassName='w-[12vw]'>
      {[
        CalendarInterval.MONTH,
        CalendarInterval.QUARTERLY,
        CalendarInterval.FOUR_MONTHS,
        CalendarInterval.YEAR_SCROLL,
        CalendarInterval.YEAR
      ].map((interval) => (
        <Dropdown.Button
          key={interval}
          label={interval}
          onClick={() => dispatch(setInterval(interval))}
          id={'cal-view-dropdown'}
        />
      ))}
    </Dropdown>
  )
}
