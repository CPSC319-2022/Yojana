import React, { Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { Button } from '@/components/common/Button'

interface DropdownProps {
  title: string
  menuItems: {
    key: string
    label: string
    onClick: () => void
  }[]
  containerClassName?: string
}

export const Dropdown = ({ title, menuItems, containerClassName = '' }: DropdownProps) => {
  return (
    <div className={containerClassName} title={title}>
      <Menu as='div' className='relative inline-block text-left'>
        {({ open, close }) => (
          <>
            <Menu.Button as={Button} text={title} onClick={() => open && close()} />
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
                  {menuItems.map((item) => (
                    <Menu.Item key={item.key}>
                      {({ active }) => (
                        <button
                          onClick={item.onClick}
                          className={`${active && 'bg-slate-100'} group flex w-full items-center rounded-md px-2 py-2`}
                        >
                          {item.label}
                        </button>
                      )}
                    </Menu.Item>
                  ))}
                </div>
              </Menu.Items>
            </Transition>
          </>
        )}
      </Menu>
    </div>
  )
}
