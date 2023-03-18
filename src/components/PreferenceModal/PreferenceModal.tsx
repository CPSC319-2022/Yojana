import { Accordion, Modal, Toggle } from '@/components/common'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import {
  getPreferences,
  setMonthCategoryAppearance,
  setYearOverflow,
  setYearShowGrid
} from '@/redux/reducers/PreferencesReducer'
import { setCookieMaxAge } from '@/utils/cookies'

export const PreferenceModal = ({
  isModalOpen,
  setIsModalOpen
}: {
  isModalOpen: boolean
  setIsModalOpen: (isModalOpen: boolean) => void
}) => {
  const dispatch = useAppDispatch()
  const { yearShowGrid, yearOverflow, monthCategoryAppearance } = useAppSelector(getPreferences)

  return (
    <Modal
      buttonText=''
      title='Preferences'
      isOpen={isModalOpen}
      setIsOpen={setIsModalOpen}
      minWidth={'25vw'}
      draggable={true}
      closeWhenClickOutside={false}
      handle={'preferences-modal-handle'}
      bounds={'preferences-modal-wrapper'}
      buttonClassName={`group flex w-full items-center rounded-md hover:bg-slate-100`}
      showCloseBtn={true}
      overrideDefaultButtonStyle={true}
      bodyPadding='px-4 pb-4 pt-3'
      scrollable={false}
      showOverflow={true}
    >
      <div className='mt-2'>
        <Accordion>
          <Accordion.Item>
            <Accordion.Header>Year View</Accordion.Header>
            <Accordion.Body>
              <div className='mt-2 flex flex-col space-y-2'>
                <Toggle
                  textToToggle={['Wrap Icons', 'Scroll Icons']}
                  name={yearOverflow.cookieName}
                  preference={yearOverflow.value === 'wrap'}
                  onChange={() => {
                    dispatch(setYearOverflow(yearOverflow.value === 'wrap' ? 'scroll' : 'wrap'))
                    setCookieMaxAge(yearOverflow.cookieName, yearOverflow.value === 'wrap' ? 'scroll' : 'wrap')
                  }}
                  tooltipIcon='QuestionCircle'
                  tooltipText='Wrap icons to the next line or scroll icons horizontally if there is not enough space to display them all on one day.'
                />
                <Toggle
                  textToToggle={['Show Grid', 'Hide Grid']}
                  name={yearShowGrid.cookieName}
                  preference={yearShowGrid.value}
                  onChange={() => {
                    dispatch(setYearShowGrid(!yearShowGrid.value))
                    setCookieMaxAge(yearShowGrid.cookieName, !yearShowGrid.value)
                  }}
                  tooltipIcon='QuestionCircle'
                  tooltipText='Show or hide the grid lines for days.'
                />
              </div>
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item>
            <Accordion.Header>Month View</Accordion.Header>
            <Accordion.Body>
              <div className='mt-2 flex flex-col space-y-2'>
                <Toggle
                  textToToggle={['Icons', 'Banners']}
                  name={monthCategoryAppearance.cookieName}
                  preference={monthCategoryAppearance.value === 'icons'}
                  onChange={() => {
                    dispatch(
                      setMonthCategoryAppearance(monthCategoryAppearance.value === 'icons' ? 'banners' : 'icons')
                    )
                    setCookieMaxAge(
                      monthCategoryAppearance.cookieName,
                      monthCategoryAppearance.value === 'icons' ? 'banners' : 'icons'
                    )
                  }}
                  tooltipIcon='QuestionCircle'
                  tooltipText='Show categories as icons or banners.'
                  disabled
                />
              </div>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </div>
    </Modal>
  )
}
