import { Modal } from '@/components/common'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { setAlert } from '@/redux/reducers/AlertReducer'
import { deleteCategory, getSpecificCategory } from '@/redux/reducers/AppDataReducer'
import { useState } from 'react'

export const DeleteCategoryModal = ({ id, onClose }: { id: number; onClose: () => void }) => {
  const dispatch = useAppDispatch()
  const currentState = useAppSelector((state) => getSpecificCategory(state, id))
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleDelete = async () => {
    setIsSubmitting(true)
    const response = await fetch('api/cats/' + currentState?.id, {
      method: 'DELETE'
    })
    if (response.ok) {
      const toDelete = Number(currentState?.id)
      dispatch(deleteCategory(toDelete))
      setIsModalOpen(false)
    } else {
      dispatch(setAlert({ message: 'Something went wrong. Please try again later.', type: 'error', show: true }))
    }
    setIsSubmitting(false)
    onClose()
  }
  return (
    <Modal
      buttonText='Delete'
      title=''
      isOpen={isModalOpen}
      setIsOpen={setIsModalOpen}
      maxWidth={'40vw'}
      draggable={false}
      closeWhenClickOutside={true}
      handle={'delete-category-modal-handle'}
      bounds={'delete-category-modal-wrapper'}
      buttonClassName={`group flex w-full items-center rounded-md px-2 py-2 hover:bg-slate-100`}
      showCloseBtn={false}
      overrideDefaultButtonStyle={true}
    >
      <div className='mt-2 p-3'>
        <div className='flex justify-center text-lg'>Are you sure you want to delete {`"${currentState?.name}"`}?</div>
        <div className='mt-5 flex justify-center'>
          <button
            type='button'
            className='mr-3 inline-flex justify-center rounded-md border border-transparent bg-slate-100 py-2 px-4 text-slate-900 enabled:hover:bg-slate-200 disabled:opacity-75'
            disabled={isSubmitting}
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type='button'
            className='inline-flex justify-center rounded-md border border-transparent bg-red-100 py-2 px-4 text-red-900 enabled:hover:bg-red-200 disabled:opacity-75'
            disabled={isSubmitting}
            onClick={handleDelete}
          >
            Confirm
          </button>
        </div>
      </div>
    </Modal>
  )
}
