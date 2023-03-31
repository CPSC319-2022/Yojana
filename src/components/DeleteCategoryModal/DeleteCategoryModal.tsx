import { Modal } from '@/components/common'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { setAlert } from '@/redux/reducers/AlertReducer'
import { deleteCategory, getCategory } from '@/redux/reducers/AppDataReducer'
import { useState } from 'react'

/*
 * This file creates the modal for confirming deletion of a category which can accessed using the dropdown in the sidebar
 *  for each category. On confirming delete, an HTTP request to delete specified category is made.
 */

export const DeleteCategoryModal = ({ id, onClose }: { id: number; onClose: () => void }) => {
  const dispatch = useAppDispatch()
  const currentState = useAppSelector((state) => getCategory(state, id))
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
      buttonId='delete-category-btn'
      buttonText='Delete'
      title=''
      isOpen={isModalOpen}
      setIsOpen={setIsModalOpen}
      maxWidth={'40vw'}
      draggable={false}
      closeWhenClickOutside={true}
      closeParent={onClose}
      handle={'delete-category-modal-handle'}
      bounds={'delete-category-modal-wrapper'}
      buttonClassName={`group flex w-full items-center rounded-md px-2 py-2 hover:bg-slate-100`}
      showCloseBtn={false}
      overrideDefaultButtonStyle={true}
    >
      <div className='mt-2 p-3' id='confirm-delete'>
        <div className='flex justify-center text-center text-lg'>
          Are you sure you want to delete {`"${currentState?.name}"`}?
        </div>
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
            id='confirm-delete-category'
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
