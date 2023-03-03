import { useState } from 'react'
import { Modal } from '@/components/common'
import { useAppDispatch } from '@/redux/hooks'
import { CsvUploader } from '@/components/sideBar'
import { setAlert } from '@/redux/reducers/AlertReducer'

export const CsvModal = () => {
  const dispatch = useAppDispatch()

  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleUploadSuccess = (number?: number, error?: string) => {
    setIsModalOpen(false)
    if (error) {
      dispatch(setAlert({ message: `There was an error processing your request: ${error}`, type: 'error', show: true }))
    } else {
      dispatch(setAlert({ message: `successfully addded ${number} entries`, type: 'success', show: true }))
    }
  }

  return (
    <>
      <Modal
        buttonText='Import'
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        draggable={false}
        closeWhenClickOutside={true}
        handle='csv-import-modal-handle'
        bounds='csv-import-modal-wrapper'
        buttonClassName='ml-3'
        showCloseBtn={false}
        bodyPadding='p-6'
        minWidth='30vw'
      >
        <div className='flex h-full w-full flex-col'>
          <h3 className='mb-2 text-lg'>Import from CSV</h3>
          <p className='text-sm'>
            Upload a CSV file with the following format: <br />
            <table className='mb-6 mt-3 w-full table-auto'>
              <thead>
                <tr>
                  <th className='border px-4 py-2'>Category</th>
                  <th className='border px-4 py-2'>Date</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className='border px-4 py-2'>
                    <span>Pay Check</span>
                    <span className='text-slate-400'> (Category Name)</span>
                  </td>
                  <td className='border px-4 py-2'>
                    <span>2021-01-01</span>
                    <span className='text-slate-400'> (YYYY-MM-DD)</span>
                  </td>
                </tr>
                <tr>
                  <td className='border px-4 py-2'>Workshop</td>
                  <td className='border px-4 py-2'>2021-01-02</td>
                </tr>
              </tbody>
            </table>
          </p>
          <CsvUploader onSuccess={handleUploadSuccess} />
        </div>
      </Modal>
    </>
  )
}
