import { Modal } from '@/components/common'
import { useState } from 'react'

export const PreferenceModal = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <Modal
      buttonText='Preferences'
      title=''
      isOpen={isModalOpen}
      setIsOpen={setIsModalOpen}
      maxWidth={'40vw'}
      draggable={true}
      closeWhenClickOutside={false}
      handle={'delete-category-modal-handle'}
      bounds={'delete-category-modal-wrapper'}
      buttonClassName={`group flex w-full items-center rounded-md px-2 py-2 hover:bg-slate-100`}
      showCloseBtn={true}
      overrideDefaultButtonStyle={true}
    >
      <div className='mt-2 p-3'>hi</div>
    </Modal>
  )
}
