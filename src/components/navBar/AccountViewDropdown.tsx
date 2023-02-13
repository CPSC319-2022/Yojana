import React, { Fragment, ReactElement, useMemo } from 'react'
import { getInterval, setInterval } from '@/redux/reducers/MainCalendarReducer'
import { AccountInterval, CalendarInterval } from '@/constants/enums'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { signOut, useSession } from 'next-auth/react'
import { Menu, Transition } from '@headlessui/react'

export const AccountViewDropdown = (): ReactElement => {
  const dispatch = useAppDispatch()
  const activeCalView = useAppSelector(getInterval)
  const { data: session } = useSession()
  var sessionU = session?.user.isAdmin ? 'Admin' : 'User'

  //  const renderItems = useMemo(() => {
  const onSelect = (selectedKey: string) => {
    if (selectedKey == 'Logout' && selectedKey !== null) {
      signOut().then(() => {
        console.log('Logged out')
      })
    } else {
    }
  }

  return (
    <div id='account-view-menu' className='dropdown' title='account'>
      <Menu as='div' className='relative inline-block text-left'>
        <div>
          <Menu.Button className='inline-flex w-full justify-center rounded-md border border-gray-200 bg-white bg-opacity-20 px-4 py-2 text-sm font-medium text-black hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75'>
            Account
          </Menu.Button>
        </div>
        <Transition
          as={Fragment}
          enter='transition ease-out duration-100'
          enterFrom='transform opacity-0 scale-95'
          enterTo='transform opacity-100 scale-100'
          leave='transition ease-in duration-75'
          leaveFrom='transform opacity-100 scale-100'
          leaveTo='transform opacity-0 scale-95'
        >
          <Menu.Items className='absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'>
            <div className='px-1 py-1 '>
              <Menu.Item>
                {({ active }) => (
                  <button
                    key={'Logout'}
                    onClick={() => onSelect('Logout')}
                    className={`${
                      active ? 'bg-gray-300 text-black' : 'text-gray-900'
                    } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                  >
                    Logout
                  </button>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button
                    key={'ID'}
                    onClick={() => onSelect('ID')}
                    className={`${
                      active ? 'bg-gray-300 text-black' : 'text-gray-900'
                    } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                  >
                    {sessionU}
                  </button>
                )}
              </Menu.Item>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  )
  /*
    return Object.values(AccountInterval).map((view) => {
      return (
        <li key={view} onClick={() => onSelect(view)} className='p-2 hover:bg-gray-200'>
          {view}
        </li>
      )
    })
  }, [dispatch, activeCalView])

  /*
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
   */
}
