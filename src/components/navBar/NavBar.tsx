import React, { ReactElement } from 'react'
import { AccountViewDropdown } from './AccountViewDropdown'
import { CalViewDropdown } from './CalViewDropdown'
import { decrementDate, getDate, incrementDate, isYearInterval } from '@/redux/reducers/MainCalendarReducer'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { Button } from '@/components/common'

interface NavBarProps {
  className: string
}

export const NavBar = (props: NavBarProps): ReactElement => {
  const dispatch = useAppDispatch()
  const targetDate = useAppSelector(getDate)
  const yearView = useAppSelector(isYearInterval)

  return (
    <div className={props.className + ' ' + 'justify-between'}>
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
