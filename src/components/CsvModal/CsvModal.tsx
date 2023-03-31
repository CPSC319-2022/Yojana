import { useState } from 'react'
import { Modal } from '@/components/common'
import { useAppDispatch } from '@/redux/hooks'
import { CsvUploader } from '@/components/sideBar'
import { setAlert } from '@/redux/reducers/AlertReducer'
import { setAppData } from '@/redux/reducers/AppDataReducer'
import { BatchResponse, CategoryFull } from '@/types/prisma'
import { getCookies } from 'cookies-next'
import { setCookieMaxAge } from '@/utils/cookies'

/*
 * The CSV modal facilitates batch importing dates into the Yojana calendar, in the specified formats shown in the
 * example. It takes in a .csv file as an input and updates the user on completion of the adding operation with how
 * many entries were successfully added. A template is provided for users to follow the correct format for the csv.
 */
export const setCategoryShow = (categories: CategoryFull[]) => {
  const cookies = getCookies()

  return categories.map((category: CategoryFull) => {
    let show = true
    const key = `yojana.show-category-${category.id}`
    if (cookies[key] === undefined) {
      // if cookie is undefined, set it to true
      setCookieMaxAge(key, 'true')
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

  const handleUploadSuccess = (response?: BatchResponse) => {
    setIsModalOpen(false)
    if (response?.error || response?.success === undefined) {
      const errorMessage = response?.error?.message
      const uneditableCategories = response?.error?.uneditableCategories
      const errorCode = response?.error?.code
      if (errorCode === 401) {
        dispatch(
          setAlert({
            message: `You either do not have access to the following category ids or they do not exist: ${uneditableCategories?.join(
              ', '
            )}`,
            type: 'error',
            show: true
          })
        )
        return
      } else if (errorCode === 422) {
        dispatch(
          setAlert({
            message: errorMessage || '',
            type: 'warn',
            show: true
          })
        )
        return
      }
      dispatch(setAlert({ message: errorMessage || '', type: 'error', show: true }))
    } else {
      const createdEntries = response?.success?.entriesAdded
      const categories = response?.success?.appData
      const appData = setCategoryShow(categories!)
      dispatch(setAppData(appData))
      dispatch(setAlert({ message: `Successfully added ${createdEntries} entries`, type: 'success', show: true }))
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
        buttonClassName='ml-3 truncate'
        showCloseBtn={false}
        bodyPadding='p-6'
        minWidth='35vw'
        buttonId={'csv-import-modal-button'}
        id='import-modal-div'
      >
        <div className='flex h-full w-full flex-col'>
          <h3 className='mb-2 text-lg font-medium'>Import from CSV</h3>
          <div className='text-sm'>
            Upload a CSV file with the following format (
            <a
              href='/template.csv'
              className='text-blue-600 underline visited:text-purple-600 hover:text-blue-800'
              download
            >
              click here to download a template
            </a>
            ):
            <br />
            <table className='mb-6 mt-3 w-full table-auto'>
              <thead>
                <tr>
                  <th className='border px-4 py-2'>CategoryID</th>
                  <th className='border px-4 py-2'>Date</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className='border px-4 py-2'>
                    <span>1</span>
                    <span className='text-slate-400'> (Check category details for ID)</span>
                  </td>
                  <td className='border px-4 py-2'>
                    <span>2021-01-01</span>
                    <span className='text-slate-400'> (YYYY-MM-DD)</span>
                  </td>
                </tr>
                <tr>
                  <td className='border px-4 py-2'>2</td>
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
