import { Button, IconName } from '@/components/common'
import { Menu, Transition } from '@headlessui/react'
import React, { Dispatch, Fragment } from 'react'

export interface DropdownMenuItem {
  key: string
  label: string
  onClick: () => void
  props?: any
}

export interface DropdownProps {
  text?: string
  id?: number
  menuItems: DropdownMenuItem[]
  containerClassName?: string
  buttonClassName?: string
  overrideDefaultButtonStyle?: boolean
  iconName?: IconName
  setKeepFocus?: Dispatch<React.SetStateAction<number>>
  keepPanelOpen?: boolean
}

export const Dropdown = ({
  text,
  menuItems,
  containerClassName = '',
  buttonClassName,
  overrideDefaultButtonStyle,
  iconName = 'CaretDownFill'
}: DropdownProps) => {
  return (
    <div className={containerClassName}>
      <Menu as='div' className='relative inline-block text-left'>
        {({ open, close }) => (
          <>
            <Menu.Button
              as={Button}
              text={text}
              iconName={iconName}
              iconClassName={`mt-1 ml-1.5 ${open ? 'rotate-180' : ''}`}
              onClick={() => open && close()}
              className={buttonClassName}
              overrideDefaultStyle={overrideDefaultButtonStyle}
            />
            <Transition
              as={Fragment}
              enter='transition ease-out duration-100'
              enterFrom='transform opacity-0 scale-95'
              enterTo='transform opacity-100 scale-100'
              leave='transition ease-in duration-75'
              leaveFrom='transform opacity-100 scale-100'
              leaveTo='transform opacity-0 scale-95'
            >
              <Menu.Items
                className={`absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none 
                `}
              >
                <div className='px-1 py-1 '>
                  {menuItems.map((item) => (
                    <Menu.Item key={item.key}>
                      {({ active }) => (
                        <button
                          type='button'
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
