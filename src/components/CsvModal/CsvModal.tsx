import { useSession } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import { useState } from 'react'
import { Alert, Modal } from '@/components/common'
import { useAppDispatch } from '@/redux/hooks'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { CsvUploader } from '@/components/sideBar'
import { AlertProps } from '@/components/common/Alert'

const schema = z.object({
  name: z.string().trim().min(1, { message: 'Name cannot be empty' }).max(191),
  description: z.string().trim().max(191).optional(),
  color: z.string().refine((color) => /^#[0-9A-F]{6}$/i.test(color), { message: 'Invalid color' })
})

type Schema = z.infer<typeof schema>

export const CsvModal = () => {
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
  const [alertType, setAlertType] = useState<AlertProps>({
    children: undefined,
    setShow(show: boolean): void {},
    show: false,
    type: 'success'
  })

  const handleUploadSuccess = (number: number, error: boolean) => {
    setIsModalOpen(false)
    setAlertMessage(`${error ? 'There was an error adding your entries' : `Successfully added ${number} entries`}`)
    setShowAlert(true)
    if (error) {
      setAlertType({ type: 'error', show: true, setShow: setShowAlert, children: undefined })
    } else {
      setAlertType({ type: 'success', show: true, setShow: setShowAlert, children: undefined })
    }
  }

  return (
    <>
      <Modal
        buttonText='Batch Add'
        title='Batch Add Categories and Entries'
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        maxWidth={'40vw'}
        draggable={true}
        // consider making this the default behavior
        closeWhenClickOutside={true}
        handle={'create-category-modal-handle'}
        bounds={'create-category-modal-wrapper'}
        buttonClassName={'ml-5'}
      >
        <CsvUploader onSuccess={handleUploadSuccess} />
      </Modal>
      <Alert type={alertType.type} setShow={setShowAlert} show={showAlert}>
        <strong className='font-bold'></strong> <span className='block sm:inline'>{alertMessage}</span>
      </Alert>
    </>
  )
}
