import React from 'react'
import { AccountViewDropdown } from './AccountViewDropdown'
import { CalViewDropdown } from './CalViewDropdown'
import {
  decrementDate,
  getDate,
  incrementDate,
  isYearInterval,
  jumpToToday
} from '@/redux/reducers/MainCalendarReducer'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { Button } from '@/components/common'

interface NavBarProps {
  sidebarOpen: boolean
  setSidebarOpen: (value: boolean) => void
}

export const NavBar = ({ sidebarOpen, setSidebarOpen }: NavBarProps) => {
  const dispatch = useAppDispatch()
  const targetDate = useAppSelector(getDate)
  const yearView = useAppSelector(isYearInterval)

  return (
    <div className='box-border flex h-[10vh] w-full flex-row items-center justify-between border-b px-5'>
      <div className='flex flex-row items-center'>
        <Button
          text='&#9776;'
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className='mr-5 text-2xl'
          padding='px-3 pt-0.5 pb-2'
        />
        <h1 className='text-2xl font-medium'>Yojana</h1>
      </div>
      <div className='flex w-[25vw] flex-row items-center'>
        <Button text='Today' onClick={() => dispatch(jumpToToday())} className='mr-10' />
        <Button text='&lt;' onClick={() => dispatch(decrementDate())} className='mr-3' />
        <Button text='&gt;' onClick={() => dispatch(incrementDate())} className='mr-3' />
        <h4 className='text-center text-lg'>{targetDate.format(yearView ? 'YYYY' : 'MMMM YYYY')}</h4>
      </div>
      <CalViewDropdown />
      <AccountViewDropdown />
    </div>
  )
}
