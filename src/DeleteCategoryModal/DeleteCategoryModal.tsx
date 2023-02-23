import { Button, Modal } from '@/components/common'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { setAlert } from '@/redux/reducers/AlertReducer'
import { deleteCategory, getSpecificCategory } from '@/redux/reducers/AppDataReducer'
import { Category, Entry } from '@prisma/client'
import { useSession } from 'next-auth/react'
import { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'

export const DeleteCategoryModal = ({ id, isOpen, onClose }: { id: number; isOpen: boolean; onClose: any }) => {
  const { data: session } = useSession()
  const dispatch = useAppDispatch()
  const currentState = useAppSelector((state) => getSpecificCategory(state, id))
  const {
    handleSubmit,
    formState: { isSubmitting, errors }
  } = useForm<any>({
    shouldUseNativeValidation: true,
    mode: 'onSubmit',
    reValidateMode: 'onBlur'
  })
  const [isModalOpen, setIsModalOpen] = useState(false)

  const onSubmit: SubmitHandler<any> = async ({}) => {
    if (!session) {
      console.error('No session found')
      return
    }
    const response = await fetch('api/cats/' + currentState?.id, {
      method: 'DELETE'
    })
    if (response.ok) {
      const data: Category & { entries: Entry[] } = await response.json()
      const toDelete = Number(currentState?.id)
      dispatch(deleteCategory(toDelete))
      setIsModalOpen(false)
    } else {
      if (response.status !== 500) {
        const text = await response.text()
        dispatch(setAlert({ message: text, type: 'error', show: true }))
      } else {
        dispatch(setAlert({ message: 'Something went wrong. Please try again later.', type: 'error', show: true }))
      }
    }
    onClose()
  }
  return (
    <>
      <Modal
        buttonText='Delete'
        title='Delete Category'
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        maxWidth={'40vw'}
        draggable={true}
        closeWhenClickOutside={false}
        handle={'create-category-modal-handle'}
        bounds={'create-category-modal-wrapper'}
        buttonClassName={`w-16 inline-flex justify-center bg-white rounded-md border border-transparent font-medium`}
      >
        <form onSubmit={handleSubmit(onSubmit)} className='mt-2'>
          <div className='mb-4'>
            <label className='mb-2 block'>Are you sure?</label>
          </div>

          <div className='flex justify-end'>
            <Button
              type='button'
              disabled={isSubmitting}
              text='Cancel'
              className='mr-3 bg-red-100 text-black focus-visible:ring-red-400 enabled:hover:bg-red-400'
              onClick={onClose}
            />
            <Button
              type='submit'
              disabled={isSubmitting}
              text='Confirm'
              className='bg-red-600 text-white focus-visible:ring-red-900 enabled:hover:bg-red-900'
              onClick={handleSubmit(onSubmit)}
            />
          </div>
        </form>
      </Modal>
    </>
  )
}
