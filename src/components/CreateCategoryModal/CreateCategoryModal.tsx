import { useSession } from 'next-auth/react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { ColorPicker } from '@/components/ColorPicker'
import { useState } from 'react'
import { Alert, Button, Modal } from '@/components/common'
import { useAppDispatch } from '@/redux/hooks'
import { Category } from '@prisma/client'
import { addCategory } from '@/redux/reducers/AppDataReducer'
import { randomColor } from '@/utils/color'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

const schema = z.object({
  name: z.string().trim().min(1, { message: 'Name cannot be empty' }).max(191),
  description: z.string().trim().max(191).optional(),
  color: z.string().refine((color) => /^#[0-9A-F]{6}$/i.test(color), { message: 'Invalid color' })
})

type Schema = z.infer<typeof schema>

export const CreateCategoryModal = () => {
  const { data: session } = useSession()
  const dispatch = useAppDispatch()
  const {
    register,
    handleSubmit,
    control,
    formState: { isSubmitting },
    reset
  } = useForm<Schema>({
    resolver: zodResolver(schema),
    shouldUseNativeValidation: true
  })

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [showAlert, setShowAlert] = useState(false)
  const [alertMessage, setAlertMessage] = useState('')

  const onSubmit: SubmitHandler<Schema> = async ({ name, color, description }) => {
    if (!session) {
      console.error('No session found')
      return
    }
    const response = await fetch('api/cats', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: name,
        description: description,
        color: color,
        creatorId: session.user.id,
        dates: []
      })
    })
    if (response.ok) {
      const data: Category = await response.json()
      dispatch(
        addCategory({
          id: data.id,
          color: data.color,
          name: data.name,
          description: data.description,
          isMaster: data.isMaster,
          icon: data.icon,
          show: true,
          creator: {
            id: session.user.id,
            name: session.user.name,
            email: session.user.email,
            isAdmin: session.user.isAdmin
          },
          entries: []
        })
      )
      reset(() => ({
        name: '',
        description: '',
        color: randomColor()
      }))
      setIsModalOpen(false)
    } else {
      const text = await response.text()
      setAlertMessage(text)
      setShowAlert(true)
    }
  }

  return (
    <>
      <Modal
        buttonText='Create Category'
        title='Create Category'
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        maxWidth={'40vw'}
        draggable={true}
        closeWhenClickOutside={false}
        handle={'create-category-modal-handle'}
        bounds={'create-category-modal-wrapper'}
        buttonClassName={'mt-4 truncate'}
      >
        <form onSubmit={handleSubmit(onSubmit)} className='mt-2'>
          <div className='mb-4'>
            <label className='mb-2 block font-medium text-gray-700'>Name</label>
            <input
              placeholder='Enter a name for the category'
              className='focus:shadow-outline w-full appearance-none rounded-md border py-2 px-3 leading-tight text-gray-700 shadow invalid:border-red-500 invalid:bg-red-50 invalid:text-red-500 invalid:placeholder-red-500 focus:outline-none'
              {...register('name')}
            />
          </div>
          <div className='mb-4'>
            <label className='mb-2 block font-medium text-gray-700'>Description</label>
            <textarea
              placeholder='Enter a description for the category'
              className='focus:shadow-outline w-full appearance-none rounded-md border py-2 px-3 leading-tight text-gray-700 shadow focus:outline-none'
              {...register('description')}
            />
          </div>
          <div className='mb-6'>
            <label className='mb-2 block font-medium text-gray-700'>Color</label>
            <ColorPicker control={control} name='color' rules={{ required: true }} />
          </div>
          <Button type='submit' disabled={isSubmitting} text='Create' onClick={handleSubmit(onSubmit)} />
        </form>
      </Modal>
      <Alert type='error' setShow={setShowAlert} show={showAlert}>
        <strong className='font-bold'>Error:</strong> <span className='block sm:inline'>{alertMessage}</span>
      </Alert>
    </>
  )
}
