import React, { ReactElement } from 'react'
import { AccountViewDropdown } from './AccountViewDropdown'
import { CalViewDropdown } from './CalViewDropdown'
import { decrementDate, getDate, incrementDate, isYearInterval } from '@/redux/reducers/MainCalendarReducer'
import { signOut, useSession } from 'next-auth/react'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'

interface NavBarProps {
  className: string
}

export const NavBar = (props: NavBarProps): ReactElement => {
  const dispatch = useAppDispatch()
  const targetDate = useAppSelector(getDate)
  const yearView = useAppSelector(isYearInterval)
  const { data: session } = useSession()

  return (
    <div className={props.className + ' ' + 'justify-between'}>
      <h1 className='text-2xl font-medium'>Calendar</h1>
      <div className='flex flex-row'>
        <button
          className='btn border border-gray-200 bg-white px-2 py-1 text-sm font-medium text-black focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-600 focus-visible:ring-offset-2 enabled:hover:bg-gray-100 disabled:opacity-75 '
          onClick={() => dispatch(decrementDate())}
        >
          &lt;
        </button>
        <h4 className='ml-3 mr-3 text-center text-xl'>{targetDate.format(yearView ? 'YYYY' : 'MMMM YYYY')}</h4>
        <button
          className='btn border border-gray-200 bg-white px-2 py-1 text-sm font-medium text-black focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-600 focus-visible:ring-offset-2 enabled:hover:bg-gray-100 disabled:opacity-75 '
          onClick={() => dispatch(incrementDate())}
        >
          &gt;
        </button>
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
