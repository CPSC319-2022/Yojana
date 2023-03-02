import { useState } from 'react'
import { Modal } from '@/components/common'
import { useAppDispatch } from '@/redux/hooks'
import { CsvUploader } from '@/components/sideBar'
import { setAlert } from '@/redux/reducers/AlertReducer'

export const CsvModal = () => {
  const dispatch = useAppDispatch()

  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleUploadSuccess = (number: number, error: boolean) => {
    setIsModalOpen(false)
    if (error) {
      dispatch(setAlert({ message: `There was an error processing your request`, type: 'error', show: true }))
    } else {
      dispatch(setAlert({ message: `successfully addded ${number} entries`, type: 'success', show: true }))
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
        buttonClassName={'ml-5 mt-2'}
      >
        <CsvUploader onSuccess={handleUploadSuccess} />
      </Modal>
    </>
  )
}
