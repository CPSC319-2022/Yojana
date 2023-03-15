import { Accordion, Dropdown, Modal, Toggle } from '@/components/common'
import { signOut, useSession } from 'next-auth/react'
import { useState } from 'react'
import { setCookieMaxAge } from '@/utils/cookies'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import {
  getPreferences,
  setMonthCategoryAppearance,
  setYearOverflow,
  setYearShowGrid
} from '@/redux/reducers/PreferencesReducer'
import { CategoryState } from '@/types/prisma'
import { getCategories } from '@/redux/reducers/AppDataReducer'

export const AccountDropdown = () => {
  const { data: session } = useSession()
  const name = session?.user.name || ''

  const [isModalOpen, setIsModalOpen] = useState(false)
  const dispatch = useAppDispatch()
  const { yearShowGrid, yearOverflow, monthCategoryAppearance } = useAppSelector(getPreferences)

  const categories: CategoryState[] = useAppSelector(getCategories)
  const categoriesWithShowTrue = categories
    .filter((category) => category.show)
    .map((category) => category.name)
    .join(',')

  return (
    <div>
      <Dropdown text='Account' containerClassName='w-[12vw]'>
        <Dropdown.Button key='User' label={name} onClick={() => {}} />
        <Dropdown.Button key='Preferences' label='Preferences' onClick={() => setIsModalOpen(true)} />
        <Dropdown.Accordion
          title='Export Calendar'
          menuItems={[
            {
              key: 'Master Calendar',
              label: 'Master Calendar',
              onClick: () => {
                window.open(`/api/dates/export`, '_blank')
              }
            },
            {
              key: 'Personal Calendar',
              label: 'Personal Calendar',
              onClick: () => {}
            },
            {
              key: 'Filtered Categories',
              label: 'Filtered Categories',
              onClick: () => {
                window.open(`/api/dates/export?categories=${categoriesWithShowTrue}`, '_blank')
              }
            }
          ]}
        />
        <Dropdown.Button key='Logout' label='Logout' onClick={() => signOut()} />
      </Dropdown>
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
    </div>
  )
}
