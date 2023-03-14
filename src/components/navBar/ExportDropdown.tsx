import { Accordion, Button, IconName } from '@/components/common'
import { Menu, Transition } from '@headlessui/react'
import React, { Dispatch, Fragment } from 'react'
import { useAppSelector } from '@/redux/hooks'
import { CategoryState } from '@/types/prisma'
import { getCategories } from '@/redux/reducers/AppDataReducer'

export interface DropdownProps {
  text?: string
  id?: number
  menuItems: {
    key: string
    label: string
    onClick: () => void
    props?: any
  }[]
  containerClassName?: string
  buttonClassName?: string
  overrideDefaultButtonStyle?: boolean
  iconName?: IconName
  setKeepFocus?: Dispatch<React.SetStateAction<number>>
  keepPanelOpen?: boolean
}

export const ExportDropdown = ({
  text,
  menuItems,
  containerClassName = '',
  buttonClassName,
  overrideDefaultButtonStyle,
  iconName = 'CaretDownFill'
}: DropdownProps) => {
  const categories: CategoryState[] = useAppSelector(getCategories)
  const categoriesWithShowTrue = categories
    .filter((category) => category.show)
    .map((category) => category.name)
    .join(',')
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
                className='absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md
              bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'
              >
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
                  <Accordion>
                    <Accordion.Item>
                      <Accordion.Header>Export Calendar</Accordion.Header>
                      <Accordion.Body>
                        <button
                          className={`group flex w-full items-center rounded-md px-2 py-2`}
                          onClick={() => {
                            window.open(`/api/dates/export`, '_blank')
                            close()
                          }}
                          onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => {
                            e.currentTarget.classList.add('bg-slate-100')
                          }}
                          onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => {
                            e.currentTarget.classList.remove('bg-slate-100')
                          }}
                        >
                          Master Calendar
                        </button>
                        <button
                          className={`group flex w-full items-center rounded-md px-2 py-2`}
                          onClick={() => {
                            close()
                          }}
                          onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => {
                            e.currentTarget.classList.add('bg-slate-100')
                          }}
                          onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => {
                            e.currentTarget.classList.remove('bg-slate-100')
                          }}
                        >
                          Personal Calendar
                        </button>
                        <button
                          className={`group flex w-full items-center rounded-md px-2 py-2`}
                          onClick={() => {
                            window.open(`/api/dates/export?categories=${categoriesWithShowTrue}`, '_blank')
                            close()
                          }}
                          onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => {
                            e.currentTarget.classList.add('bg-slate-100')
                          }}
                          onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => {
                            e.currentTarget.classList.remove('bg-slate-100')
                          }}
                        >
                          Filtered Categories
                        </button>
                      </Accordion.Body>
                    </Accordion.Item>
                  </Accordion>
                </div>
              </Menu.Items>
            </Transition>
          </>
        )}
      </Menu>
    </div>
  )
}
