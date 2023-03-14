import { Accordion, Modal } from '@/components/common'
import { useAppSelector } from '@/redux/hooks'
import { getCategories } from '@/redux/reducers/AppDataReducer'
import { CategoryState } from '@/types/prisma'

export const ExportModal = ({
  isModalOpen,
  setIsModalOpen
}: {
  isModalOpen: boolean
  setIsModalOpen: (isModalOpen: boolean) => void
}) => {
  const categories: CategoryState[] = useAppSelector(getCategories)
  const categoriesWithShowTrue = categories
    .filter((category) => category.show)
    .map((category) => category.name)
    .join(',')
  return (
    <Modal
      buttonText=''
      title='Export Calendar'
      isOpen={isModalOpen}
      setIsOpen={setIsModalOpen}
      minWidth={'25vw'}
      draggable={true}
      closeWhenClickOutside={false}
      handle={'export-modal-handle'}
      bounds={'export-modal-wrapper'}
      buttonClassName={`group flex w-full items-center rounded-md hover:bg-slate-100`}
      showCloseBtn={true}
      overrideDefaultButtonStyle={true}
      bodyPadding='px-4 pb-4 pt-3'
    >
      <div className='mt-2'>
        <Accordion>
          <Accordion.Item>
            <Accordion.Header>Options</Accordion.Header>
            <Accordion.Body>
              <button
                className={`group flex w-full items-center rounded-md px-2 py-2 hover:bg-slate-100`}
                onClick={() => {
                  window.open(`/api/dates/export`, '_blank')
                  close()
                }}
              >
                Master Calendar
              </button>
              <button
                className={`group flex w-full items-center rounded-md px-2 py-2 hover:bg-slate-100`}
                onClick={() => {
                  close()
                }}
              >
                Personal Calendar
              </button>
              <button
                className={`group flex w-full items-center rounded-md px-2 py-2 hover:bg-slate-100`}
                onClick={() => {
                  window.open(`/api/dates/export?categories=${categoriesWithShowTrue}`, '_blank')
                  close()
                }}
              >
                Filtered Categories
              </button>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </div>
    </Modal>
  )
}
