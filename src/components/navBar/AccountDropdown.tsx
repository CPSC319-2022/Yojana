import { Dropdown } from '@/components/common'
import { signOut, useSession } from 'next-auth/react'
import { useState } from 'react'
import { PreferenceModal } from '@/components/PreferenceModal'

export const AccountDropdown = () => {
  const { data: session } = useSession()
  const name = session?.user.name || ''

  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <div>
      <Dropdown
        text='Account'
        containerClassName='w-[12vw]'
        menuItems={[
          {
            key: 'User',
            label: name,
            onClick: () => {}
          },
          {
            key: 'Preferences',
            label: 'Preferences',
            onClick: () => {
              setIsModalOpen(true)
            }
          },
          {
            key: 'Export Calendar',
            label: 'Export Calendar',
            onClick: () => {
              window.open('/api/dates/export', '_blank')
            }
          },
          {
            key: 'Logout',
            label: 'Logout',
            onClick: () => signOut()
          }
        ]}
      />
      <PreferenceModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
    </div>
  )
}
