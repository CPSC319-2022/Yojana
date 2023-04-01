import { Modal } from '@/components/common'
import { useAppSelector } from '@/redux/hooks'
import { getCategory } from '@/redux/reducers/AppDataReducer'
import { useState } from 'react'

export const CategoryInfoModal = ({ id, onClose }: { id: number; onClose: () => void }) => {
  const category = useAppSelector((state) => getCategory(state, id))
  const [isModalOpen, setIsModalOpen] = useState(false)
  const descText = category?.description.trim().length === 0 ? 'No description provided.' : category?.description
  const email = 'mailto:' + category?.creator.email

  return (
    <Modal
      buttonId='category-info-btn'
      buttonText='Info'
      title=''
      isOpen={isModalOpen}
      setIsOpen={setIsModalOpen}
      maxWidth={'40vw'}
      draggable={false}
      closeWhenClickOutside={true}
      closeParent={onClose}
      buttonClassName={`group flex w-full items-center rounded-md px-2 py-2 hover:bg-slate-100`}
      showCloseBtn={false}
      overrideDefaultButtonStyle={true}
      bodyPadding={''}
      handle={'info-modal-handle'}
    >
      <div className='mt-0 p-0' id='category-info'>
        <style jsx>{`
          h1 {
            color: ${category?.color};
          }
        `}</style>
        <div className='max-w-60 h-fit max-h-60 w-60 overflow-y-auto break-words rounded-lg rounded-md bg-white p-3 font-normal leading-7'>
          <h1 className='pt-1 text-base'>{category?.name + ' #' + category?.id}</h1>
          <p
            className={`pt-1 text-sm ${
              descText === 'No description provided.' ? 'italic text-slate-500' : 'text-slate-700'
            }`}
          >
            {descText}
          </p>
          <p className='pt-2 text-xs text-slate-500'>
            creator:{' '}
            <a className='text-blue-600 underline visited:text-purple-600 hover:text-blue-800' href={email}>
              {category?.creator.name}
            </a>
          </p>
        </div>
      </div>
    </Modal>
  )
}
