import React from 'react'
import { getInterval, setInterval } from '@/redux/reducers/MainCalendarReducer'
import { CalendarInterval } from '@/constants/enums'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { Dropdown } from '@/components/common'

export const CalViewDropdown = () => {
  const dispatch = useAppDispatch()
  const activeCalView = useAppSelector(getInterval)

  return (
    <Dropdown text={activeCalView} containerClassName='w-[12vw]'>
      {[CalendarInterval.MONTH, CalendarInterval.QUARTERLY, CalendarInterval.FOUR_MONTHS, CalendarInterval.YEAR].map(
        (interval) => (
          <Dropdown.Button key={interval} label={interval} onClick={() => dispatch(setInterval(interval))} />
        )
      )}
    </Dropdown>
  )
}
