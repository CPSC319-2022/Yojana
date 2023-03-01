import React from 'react'
import { getInterval, setInterval } from '@/redux/reducers/MainCalendarReducer'
import { CalendarInterval } from '@/constants/enums'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { Dropdown } from '@/components/common'
import { useRouter } from 'next/router'

export const CalViewDropdown = () => {
  const dispatch = useAppDispatch()
  const activeCalView = useAppSelector(getInterval)
  const router = useRouter()

  const updateRouter = (interval: CalendarInterval) => {
    router.push(
      {
        query: {
          ...router.query,
          interval: interval
        }
      },
      undefined,
      { shallow: true }
    )
  }

  return (
    <Dropdown
      text={activeCalView}
      containerClassName='w-[12vw]'
      menuItems={[
        {
          key: CalendarInterval.MONTH,
          label: CalendarInterval.MONTH,
          onClick: () => {
            dispatch(setInterval(CalendarInterval.MONTH))
            updateRouter(CalendarInterval.MONTH)
          }
        },
        {
          key: CalendarInterval.FOUR_MONTHS,
          label: CalendarInterval.FOUR_MONTHS,
          onClick: () => {
            dispatch(setInterval(CalendarInterval.FOUR_MONTHS))
            updateRouter(CalendarInterval.FOUR_MONTHS)
          }
        },
        {
          key: CalendarInterval.YEAR,
          label: CalendarInterval.YEAR,
          onClick: () => {
            dispatch(setInterval(CalendarInterval.YEAR))
            updateRouter(CalendarInterval.YEAR)
          }
        }
      ]}
    />
  )
}
