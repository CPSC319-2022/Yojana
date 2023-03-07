import { Dropdown, Modal } from '@/components/common'
import { signOut, useSession } from 'next-auth/react'
import { useState } from 'react'

export const AccountViewDropdown = () => {
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
        title=''
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        maxWidth={'40vw'}
        draggable={true}
        closeWhenClickOutside={false}
        handle={'delete-category-modal-handle'}
        bounds={'delete-category-modal-wrapper'}
        buttonClassName={`group flex w-full items-center rounded-md hover:bg-slate-100 h-0`}
        showCloseBtn={true}
        overrideDefaultButtonStyle={true}
      >
        <div className='mt-2 p-3'>hi</div>
      </Modal>
    </div>
  )
}
