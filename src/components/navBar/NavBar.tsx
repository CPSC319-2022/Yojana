import React, { ReactElement } from 'react'
import { CalViewDropdown } from './CalViewDropdown'
import { decrementDate, getDate, incrementDate } from '@/redux/reducers/MainCalendarReducer'
import { signOut, useSession } from 'next-auth/react'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'

interface NavBarProps {
  className: string
}

export const NavBar = (props: NavBarProps): ReactElement => {
  const dispatch = useAppDispatch()
  const targetDate = useAppSelector(getDate)
  const { data: session } = useSession()

  return (
    <div className={props.className + ' ' + 'justify-between'}>
      <h1 className='text-2xl font-medium'>Calendar</h1>
      <div className='flex flex-row'>
        <button className='btn mr-2' onClick={() => dispatch(decrementDate())}>
          &lt;
        </button>
        <h4 className='w-20 text-center'>{targetDate.format('MMMM')}</h4>
        <button className='btn ml-2' onClick={() => dispatch(incrementDate())}>
          &gt;
        </button>
      </div>
      <CalViewDropdown />
      {session?.user.isAdmin ? 'Admin' : 'User'}
      {session && (
        <button className='btn' onClick={() => signOut()}>
          Logout
        </button>
      )}
    </div>
  )
}
