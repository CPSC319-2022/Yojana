import { Dropdown } from '@/components/common'
import { signOut, useSession } from 'next-auth/react'
import { useState } from 'react'
import { useAppSelector } from '@/redux/hooks'
import { CategoryState } from '@/types/prisma'
import { getCategories } from '@/redux/reducers/AppDataReducer'
import { PreferenceModal } from '@/components/PreferenceModal'

export const AccountDropdown = () => {
  const { data: session } = useSession()
  const name = session?.user.name || ''

  const [isModalOpen, setIsModalOpen] = useState(false)

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
        <Dropdown.Accordion title='Export Calendar'>
          <Dropdown.Button
            key='Master Calendar'
            label='Master Calendar'
            onClick={() => {
              window.open(`/api/dates/export`, '_blank')
            }}
          />
          <Dropdown.Button key='Personal Calendar' label='Personal Calendar' onClick={() => {}} />
          <Dropdown.Button
            key='Filtered Categories'
            label='Filtered Categories'
            onClick={() => {
              window.open(`/api/dates/export?categories=${categoriesWithShowTrue}`, '_blank')
            }}
          />
        </Dropdown.Accordion>
        <Dropdown.Button key='Logout' label='Logout' onClick={() => signOut()} />
      </Dropdown>
      <PreferenceModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
    </div>
  )
}
