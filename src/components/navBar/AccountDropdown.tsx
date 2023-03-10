import { Dropdown, Modal, Toggle } from '@/components/common'
import { signOut, useSession } from 'next-auth/react'
import { useState } from 'react'

interface AccountDropdownProps {
  prefScroll: boolean
  setPrefScroll: (value: boolean) => void
  prefGrid: boolean
  setPrefGrid: (value: boolean) => void
}

export const AccountDropdown = ({ prefScroll, setPrefScroll, prefGrid, setPrefGrid }: AccountDropdownProps) => {
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
            key: 'Logout',
            label: 'Logout',
            onClick: () => signOut()
          }
        ]}
      />
      <Modal
        buttonText=''
        title='Preferences'
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        maxWidth={'40vw'}
        draggable={true}
        closeWhenClickOutside={false}
        handle={'preferences-modal-handle'}
        bounds={'preferences-modal-wrapper'}
        buttonClassName={`group flex w-full items-center rounded-md hover:bg-slate-100`}
        showCloseBtn={true}
        overrideDefaultButtonStyle={true}
      >
        <div className='mt-2 inline-grid'>
          <Toggle
            textToToggle={['Expanded', 'Scroll']}
            cookieName='yojana.yearViewPref'
            preference={prefScroll}
            setPreference={setPrefScroll}
          />
          <Toggle
            textToToggle={['Horizontal Grid', 'No Grid']}
            cookieName='yojana.gridViewPref'
            preference={prefGrid}
            setPreference={setPrefGrid}
          />
        </div>
      </Modal>
    </div>
  )
}
