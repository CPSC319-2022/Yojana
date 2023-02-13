import React, { ReactElement } from 'react'
import { AccountViewDropdown } from './AccountViewDropdown'
import { CalViewDropdown } from './CalViewDropdown'
import { decrementDate, getDate, incrementDate, isYearInterval } from '@/redux/reducers/MainCalendarReducer'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { Button } from '@/components/common'

export const NavBar = (): ReactElement => {
  const dispatch = useAppDispatch()
  const targetDate = useAppSelector(getDate)
  const yearView = useAppSelector(isYearInterval)

  return (
    <div className='box-border flex h-[12vh] w-full flex-row items-center justify-between px-5'>
      <h1 className='text-2xl font-medium'>Yojana</h1>
      <div className='flex flex-row'>
        <Button text='<' onClick={() => dispatch(decrementDate())} className='mr-3' />
        <Button text='>' onClick={() => dispatch(incrementDate())} className='mr-3' />
        <h4 className='text-center text-lg'>{targetDate.format(yearView ? 'YYYY' : 'MMMM YYYY')}</h4>
      </div>
      <CalViewDropdown />
      <AccountViewDropdown />
    </div>
  )
}
