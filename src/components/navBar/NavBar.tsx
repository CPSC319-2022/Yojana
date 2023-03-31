import { Button } from '@/components/common'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { decrementDate, getDate, getInterval, incrementDate, jumpToToday } from '@/redux/reducers/MainCalendarReducer'
import { useRouter } from 'next/router'
import React, { useEffect, useMemo, useState } from 'react'
import { CalViewDropdown } from './CalViewDropdown'
import { AccountDropdown } from '@/components/navBar/AccountDropdown'
import { CalendarInterval } from '@/constants/enums'
import { Session } from 'next-auth'
import { getPreferences, setIsSidebarOpen } from '@/redux/reducers/PreferencesReducer'
import { getIsSelectingDates } from '@/redux/reducers/DateSelectorReducer'
import { useGetHoursInMonth } from '@/utils/month'

interface NavBarProps {
  session: Session
}

export const NavBar = ({ session }: NavBarProps) => {
  const dispatch = useAppDispatch()
  const targetDate = useAppSelector(getDate)
  const interval = useAppSelector(getInterval)
  const sidebarOpen = useAppSelector(getPreferences).sidebarOpen.value
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const disable = useAppSelector(getIsSelectingDates)
  const getHoursInMonth = useGetHoursInMonth()
  const hoursInMonth = getHoursInMonth(targetDate)

  useEffect(() => {
    // mounted ensures that the router push does not happen on the first render
    if (mounted) {
      router.push(
        {
          query: {
            ...router.query,
            interval: interval,
            date: targetDate.format('YYYY-MM-DD')
          }
        },
        undefined,
        { shallow: true }
      )
    } else {
      setMounted(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetDate, interval])

  const getIntervalDescription = useMemo(() => {
    switch (interval) {
      case CalendarInterval.YEAR:
      case CalendarInterval.YEAR_SCROLL:
        return targetDate.format('YYYY')
      case CalendarInterval.FOUR_MONTHS:
        return `${targetDate.format('MMM YYYY')} - ${targetDate.add(3, 'M').format('MMM YYYY')}`
      case CalendarInterval.QUARTERLY:
        return `Q${Math.floor(targetDate.month() / 3) + 1} ${targetDate.format('YYYY')}`
      default:
        return targetDate.format('MMMM YYYY')
    }
  }, [interval, targetDate])

  return (
    <div className='box-border flex h-[10vh] w-full flex-row items-center justify-between border-b px-5'>
      <div className='flex flex-row items-center'>
        <Button
          disabled={disable}
          text='&#9776;'
          onClick={() => {
            dispatch(setIsSidebarOpen(!sidebarOpen))
          }}
          className='mr-5 px-3 pt-0.5 pb-2 text-2xl'
        />
        <h1 className='text-2xl font-medium' id='yojana-title'>
          Yojana
        </h1>
      </div>
      <div className='flex w-[25vw] flex-row items-center'>
        <Button text='Today' onClick={() => dispatch(jumpToToday())} className='mr-10' />
        <Button iconName='CaretLeftFill' onClick={() => dispatch(decrementDate())} className='mr-3 py-3' />
        <Button
          iconName='CaretRightFill'
          onClick={() => dispatch(incrementDate())}
          className='mr-3 py-3'
          id='move-right'
        />
        <h4 className='flex-none text-center text-lg'>{getIntervalDescription}</h4>
        {interval === CalendarInterval.MONTH && (
          <>
            <h3 className='px-2 text-slate-400'>•</h3>
            <h4 className='flex-none text-center text-lg text-slate-400'>{hoursInMonth} hrs</h4>
          </>
        )}
      </div>
      <CalViewDropdown />
      <AccountDropdown session={session} />
    </div>
  )
}
