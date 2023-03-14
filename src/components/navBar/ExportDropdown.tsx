import { Accordion, Button, IconName, Modal, Toggle } from '@/components/common'
import { Menu, Transition } from '@headlessui/react'
import React, { Dispatch, Fragment, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import {
  getPreferences,
  setMonthCategoryAppearance,
  setYearOverflow,
  setYearShowGrid
} from '@/redux/reducers/PreferencesReducer'
import { setCookieMaxAge } from '@/utils/cookies'

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
  const [isModalOpen, setIsModalOpen] = useState(false)
  const dispatch = useAppDispatch()
  const { yearShowGrid, yearOverflow, monthCategoryAppearance } = useAppSelector(getPreferences)
  return (
    <div className={containerClassName}>
      <Modal
        buttonText=''
        title='Preferences'
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        minWidth={'25vw'}
        draggable={true}
        closeWhenClickOutside={false}
        handle={'preferences-modal-handle'}
        bounds={'preferences-modal-wrapper'}
        buttonClassName={`group flex w-full items-center rounded-md hover:bg-slate-100`}
        showCloseBtn={true}
        overrideDefaultButtonStyle={true}
        bodyPadding='px-4 pb-4 pt-3'
      >
        <div className='mt-2'>
          <Accordion>
            <Accordion.Item>
              <Accordion.Header>Year View</Accordion.Header>
              <Accordion.Body>
                <div className='mt-2 flex flex-col space-y-2'>
                  <Toggle
                    textToToggle={['Overflow: Expand', 'Overflow: Scroll']}
                    name={yearOverflow.cookieName}
                    preference={yearOverflow.value === 'expand'}
                    onChange={() => {
                      dispatch(setYearOverflow(yearOverflow.value === 'expand' ? 'scroll' : 'expand'))
                      setCookieMaxAge(yearOverflow.cookieName, yearOverflow.value === 'expand' ? 'scroll' : 'expand')
                    }}
                  />
                  <Toggle
                    textToToggle={['Show Grid', 'Hide Grid']}
                    name={yearShowGrid.cookieName}
                    preference={yearShowGrid.value}
                    onChange={() => {
                      dispatch(setYearShowGrid(!yearShowGrid.value))
                      setCookieMaxAge(yearShowGrid.cookieName, !yearShowGrid.value)
                    }}
                  />
                </div>
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item>
              <Accordion.Header>Month View</Accordion.Header>
              <Accordion.Body>
                <div className='mt-2 flex flex-col space-y-2'>
                  <Toggle
                    textToToggle={['Icons', 'Banners']}
                    name={monthCategoryAppearance.cookieName}
                    preference={monthCategoryAppearance.value === 'icons'}
                    onChange={() => {
                      dispatch(
                        setMonthCategoryAppearance(monthCategoryAppearance.value === 'icons' ? 'banners' : 'icons')
                      )
                      setCookieMaxAge(
                        monthCategoryAppearance.cookieName,
                        monthCategoryAppearance.value === 'icons' ? 'banners' : 'icons'
                      )
                    }}
                    disabled
                  />
                </div>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </div>
      </Modal>
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
                            window.open('/api/dates/export', '_blank')
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
