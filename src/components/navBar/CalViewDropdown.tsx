import React, { Fragment, ReactElement } from 'react'
import { getInterval, setInterval } from '@/redux/reducers/MainCalendarReducer'
import { CalendarInterval } from '@/constants/enums'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { Menu, Transition } from '@headlessui/react'

export const CalViewDropdown = (): ReactElement => {
  const dispatch = useAppDispatch()
  const activeCalView = useAppSelector(getInterval)

  const onSelect = (selectedKey: string) => {
    if (selectedKey !== activeCalView && selectedKey !== null) {
      dispatch(setInterval(selectedKey as CalendarInterval))
    }
  }

  return (
    <div id='calendar-view-menu' className='dropdown' title={activeCalView}>
      <Menu as='div' className='relative inline-block text-left'>
        <div>
          <Menu.Button className='inline-flex w-full justify-center rounded-md border border-gray-200 bg-white bg-opacity-20 px-4 py-2 text-sm font-medium text-black hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75'>
            {activeCalView}
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
                    key={'Year'}
                    onClick={() => onSelect('Year')}
                    className={`${
                      active ? 'bg-gray-300 text-black' : 'text-gray-900'
                    } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                  >
                    Year
                  </button>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button
                    key={'4 Months'}
                    onClick={() => onSelect('4 Months')}
                    className={`${
                      active ? 'bg-gray-300 text-black' : 'text-gray-900'
                    } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                  >
                    4 Months
                  </button>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button
                    key={'Month'}
                    onClick={() => onSelect('Month')}
                    className={`${
                      active ? 'bg-gray-300 text-black' : 'text-gray-900'
                    } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                  >
                    Month
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
