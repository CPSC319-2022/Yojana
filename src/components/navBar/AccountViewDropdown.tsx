import React, { ReactElement, useMemo } from 'react'
import { getInterval, setInterval } from '@/redux/reducers/MainCalendarReducer'
import { AccountInterval, CalendarInterval } from '@/constants/enums'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { signOut, useSession } from 'next-auth/react'

export const AccountViewDropdown = (): ReactElement => {
  const dispatch = useAppDispatch()
  const activeCalView = useAppSelector(getInterval)
  const { data: session } = useSession()

  const renderItems = useMemo(() => {
    const onSelect = (selectedKey: string) => {
      if (selectedKey == 'Logout' && selectedKey !== null) {
        signOut().then(() => {
          console.log('Logged out')
        })
      } else {
        return session?.user.isAdmin ? 'Admin' : 'User'
      }
    }

    return Object.values(AccountInterval).map((view) => {
      return (
        <li key={view} onClick={() => onSelect(view)} className='p-2 hover:bg-gray-200'>
          {view}
        </li>
      )
    })
  }, [dispatch, activeCalView])

  return (
    <div id='calendar-view-menu' className='dropdown' title={activeCalView}>
      <label
        tabIndex={0}
        className='font-small text-lowercase focus-visible:ring-offset-0.5 btn border border-gray-200 bg-white p-2 px-0.5 py-0.5 text-xs text-black hover:bg-gray-200'
      >
        account
      </label>
      <ul tabIndex={0} className='box dropdown-content menu w-52 bg-base-100 p-2 shadow'>
        {renderItems}
      </ul>
    </div>
  )
}
