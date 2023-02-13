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

      {/*
            {session?.user.isAdmin ? 'Admin' : 'User'}
      {session && (
        <button className='rounded-md border border-gray-200 bg-white px-2 py-1 text-sm font-medium text-black focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-600 focus-visible:ring-offset-2 enabled:hover:bg-gray-100 disabled:opacity-75' onClick={() => signOut()}>
          Logout
        </button>
      )}
    </div>
  )
             */}
    </div>
  )
}
