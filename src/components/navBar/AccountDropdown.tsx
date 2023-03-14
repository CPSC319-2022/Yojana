import { Dropdown } from '@/components/common'
import { signOut, useSession } from 'next-auth/react'
import { useState } from 'react'
import { PreferenceModal } from '@/components/PreferenceModal'
import { ExportModal } from '@/components/ExportModal'

export const AccountDropdown = () => {
  const { data: session } = useSession()
  const name = session?.user.name || ''

  const [isPrefModalOpen, setIsPrefModalOpen] = useState(false)
  const [isExportModalOpen, setIsExportModalOpen] = useState(false)

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
              setIsPrefModalOpen(true)
            }
          },
          {
            key: 'Export Calendar',
            label: 'Export Calendar',
            onClick: () => {
              setIsExportModalOpen(true)
            }
          },
          {
            key: 'Logout',
            label: 'Logout',
            onClick: () => signOut()
          }
        ]}
      />
      <PreferenceModal isModalOpen={isPrefModalOpen} setIsModalOpen={setIsPrefModalOpen} />
      <ExportModal isModalOpen={isExportModalOpen} setIsModalOpen={setIsExportModalOpen} />
    </div>
  )
}
