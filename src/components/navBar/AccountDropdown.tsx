import { Dropdown, Modal } from '@/components/common'
import { Switch } from '@headlessui/react'
import { signOut, useSession } from 'next-auth/react'
import { useState } from 'react'

export const AccountViewDropdown = () => {
  const { data: session } = useSession()
  const name = session?.user.name || ''

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [prefScroll, setPrefScroll] = useState(true)

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
        title='Pick Your Preferences'
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        maxWidth={'40vw'}
        draggable={true}
        closeWhenClickOutside={false}
        handle={'delete-category-modal-handle'}
        bounds={'delete-category-modal-wrapper'}
        buttonClassName={`group flex w-full items-center rounded-md hover:bg-slate-100`}
        showCloseBtn={true}
        overrideDefaultButtonStyle={true}
      >
        <div className='space-between mt-2 inline-flex p-3'>
          <div className='w-[12vw] text-lg'>{prefScroll ? 'Scroll' : 'Expanded'}</div>
          <Switch
            checked={prefScroll}
            onChange={setPrefScroll}
            className={`${prefScroll ? 'bg-emerald-700' : 'bg-emerald-400'}
          relative inline-flex h-[38px] w-[74px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
          >
            <span className='sr-only'>Use setting</span>
            <span
              aria-hidden='true'
              className={`${prefScroll ? 'translate-x-9' : 'translate-x-0'}
            pointer-events-none inline-block h-[34px] w-[34px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
            />
          </Switch>
        </div>
      </Modal>
    </div>
  )
}
