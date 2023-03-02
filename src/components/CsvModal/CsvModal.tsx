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
        <p className='text-sm text-gray-500'>
          Upload a CSV file with the following format: <br />
          <span className='text-gray-400'>
            Category,Date <br />
            {'<Category1 Name>'},{'<Category1 Date (yyyy-mm-dd)>'} <br />
            {'<Category2 Name>'},{'<Category2 Date (yyyy-mm-dd)>'}
          </span>
        </p>
        <CsvUploader onSuccess={handleUploadSuccess} />
      </Modal>
    </>
  )
}
