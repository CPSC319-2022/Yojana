import { Button } from '@/components/common'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import {
  decrementDate,
  getDate,
  getInterval,
  incrementDate,
  isYearInterval,
  jumpToToday
} from '@/redux/reducers/MainCalendarReducer'
import { setCookie } from 'cookies-next'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { AccountDropdown } from './AccountDropdown'
import { CalViewDropdown } from './CalViewDropdown'

interface NavBarProps {
  sidebarOpen: boolean
  setSidebarOpen: (value: boolean) => void
  prefScroll: boolean
  setPrefScroll: (value: boolean) => void
  prefGrid: boolean
  setPrefGrid: (value: boolean) => void
}

export const NavBar = ({
  sidebarOpen,
  setSidebarOpen,
  prefScroll,
  setPrefScroll,
  prefGrid,
  setPrefGrid
}: NavBarProps) => {
  const dispatch = useAppDispatch()
  const targetDate = useAppSelector(getDate)
  const yearView = useAppSelector(isYearInterval)
  const interval = useAppSelector(getInterval)
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

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

  return (
    <div className='box-border flex h-[10vh] w-full flex-row items-center justify-between border-b px-5'>
      <div className='flex flex-row items-center'>
        <Button
          text='&#9776;'
          onClick={() => {
            setSidebarOpen(!sidebarOpen)
            setCookie(`yojana.sidebar-open`, !sidebarOpen)
          }}
          className='mr-5 px-3 pt-0.5 pb-2 text-2xl'
        />
        <h1 className='text-2xl font-medium'>Yojana</h1>
      </div>
      <div className='flex w-[25vw] flex-row items-center'>
        <Button text='Today' onClick={() => dispatch(jumpToToday())} className='mr-10' />
        <Button iconName='CaretLeftFill' onClick={() => dispatch(decrementDate())} className='mr-3 py-3' />
        <Button iconName='CaretRightFill' onClick={() => dispatch(incrementDate())} className='mr-3 py-3' />
        <h4 className='flex-none text-center text-lg'>{targetDate.format(yearView ? 'YYYY' : 'MMMM YYYY')}</h4>
      </div>
      <CalViewDropdown />
      <AccountDropdown
        prefScroll={prefScroll}
        setPrefScroll={setPrefScroll}
        prefGrid={prefGrid}
        setPrefGrid={setPrefGrid}
      />
    </div>
  )
}
