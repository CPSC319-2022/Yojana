import React from 'react'
import { getInterval, setInterval } from '@/redux/reducers/MainCalendarReducer'
import { CalendarInterval } from '@/constants/enums'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { Dropdown } from '@/components/common'

export const CalViewDropdown = () => {
  const dispatch = useAppDispatch()
  const activeCalView = useAppSelector(getInterval)

  return (
    <Dropdown
      text={activeCalView}
      containerClassName='w-[12vw]'
      menuItems={[
        {
          key: CalendarInterval.MONTH,
          label: CalendarInterval.MONTH,
          onClick: () => dispatch(setInterval(CalendarInterval.MONTH))
        },
        {
          key: CalendarInterval.FOUR_MONTHS,
          label: CalendarInterval.FOUR_MONTHS,
          onClick: () => dispatch(setInterval(CalendarInterval.FOUR_MONTHS))
        },
        {
          key: CalendarInterval.YEAR,
          label: CalendarInterval.YEAR,
          onClick: () => dispatch(setInterval(CalendarInterval.YEAR))
        }
      ]}
    />
  )
}
