import { useState } from 'react'
import { Modal } from '@/components/common'
import { useAppDispatch } from '@/redux/hooks'
import { CsvUploader } from '@/components/sideBar'
import { setAlert } from '@/redux/reducers/AlertReducer'
import { setAppData } from '@/redux/reducers/AppDataReducer'
import { BatchResponse, CategoryFull } from '@/types/prisma'
import { getCookies, setCookie } from 'cookies-next'

export const setCategoryShow = (categories: CategoryFull[]) => {
  const cookies = getCookies()

  return categories.map((category: CategoryFull) => {
    let show = true
    const key = `yojana.show-category-${category.id}`
    if (cookies[key] === undefined) {
      // if cookie is undefined, set it to true
      setCookie(key, 'true')
    } else {
      // if cookie is defined, set show to the value of the cookie
      show = cookies[key] === 'true'
    }
    return { ...category, show: show }
  })
}

export const CsvModal = () => {
  const dispatch = useAppDispatch()

  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleUploadSuccess = (response?: BatchResponse, error?: string) => {
    const createdEntries = response?.createdEntries
    const categories = response?.appData
    setIsModalOpen(false)
    if (error) {
      dispatch(setAlert({ message: `There was an error processing your request: ${error}`, type: 'error', show: true }))
    } else {
      const appData = setCategoryShow(categories!)
      dispatch(setAppData(appData))
      dispatch(
        setAlert({ message: `successfully added ${createdEntries?.length} entries`, type: 'success', show: true })
      )
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
        minWidth='35vw'
      >
        <div className='flex h-full w-full flex-col'>
          <h3 className='mb-2 text-lg font-medium'>Import from CSV</h3>
          <div className='text-sm'>
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
          </div>
          <CsvUploader onSuccess={handleUploadSuccess} />
        </div>
      </Modal>
    </>
  )
}