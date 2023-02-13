import React, { Fragment, ReactElement } from 'react'
import { signOut, useSession } from 'next-auth/react'
import { Menu, Transition } from '@headlessui/react'

export const AccountViewDropdown = (): ReactElement => {
  const { data: session } = useSession()
  const sessionU = session?.user.isAdmin ? 'Admin' : 'User'

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
          <Menu.Button className='inline-flex w-full justify-center rounded-md border border-gray-200 bg-white bg-opacity-20 px-4 py-2 font-medium hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75'>
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
                    className={`${active ? 'bg-gray-300' : ''} group flex w-full items-center rounded-md px-2 py-2`}
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
                    className={`${active ? 'bg-gray-300' : ''} group flex w-full items-center rounded-md px-2 py-2`}
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
}
