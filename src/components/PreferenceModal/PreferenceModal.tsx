import { Accordion, Modal, Toggle } from '@/components/common'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import {
  getPreferences,
  setMonthCategoryAppearance,
  setShowWeekNumbers,
  setYearOverflow,
  setYearShowGrid,
  setShowWorkingHours
} from '@/redux/reducers/PreferencesReducer'
import { setCookieMaxAge } from '@/utils/cookies'
import { CalendarInterval } from '@/constants/enums'
import { getIsMobile } from '@/redux/reducers/AppDataReducer'

/**
 * PreferenceModal is responsible for rendering the preferences modal.
 * It leverages the various hooks and state management from Redux to display preferences.
 * Key functionalities:
 * Changing preferences.
 * Saving preferences to cookies.
 * Rendering preferences.
 *
 * @param {boolean} [isModalOpen] - Optional flag indicating if the PreferenceModal is open.
 * @param {boolean} [setIsModalOpen] - Optional function to set the PreferenceModal open state.
 * @returns {JSX.Element}
 */
export const PreferenceModal = ({
  isModalOpen,
  setIsModalOpen
}: {
  isModalOpen: boolean
  setIsModalOpen: (isModalOpen: boolean) => void
}) => {
  const dispatch = useAppDispatch()
  const { yearShowGrid, yearOverflow, monthCategoryAppearance, showWeekNumbers, showWorkingHours } =
    useAppSelector(getPreferences)
  const { yearShowGrid, yearOverflow, monthCategoryAppearance, showWeekNumbers } = useAppSelector(getPreferences)
  const isMobileView = useAppSelector(getIsMobile)

  return (
    <Modal
      buttonText=''
      title='Preferences'
      isOpen={isModalOpen}
      setIsOpen={setIsModalOpen}
      minWidth={'25vw'}
      draggable={!isMobileView}
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
          {!isMobileView && (
            <Accordion.Item>
              <Accordion.Header>{CalendarInterval.YEAR} View</Accordion.Header>
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
                  <Toggle
                    textToToggle={['Show working hours', 'Hide working hours']}
                    name={showWorkingHours.cookieName}
                    preference={showWorkingHours.value}
                    onChange={() => {
                      dispatch(setShowWorkingHours(!showWorkingHours.value))
                      setCookieMaxAge(showWorkingHours.cookieName, !showWorkingHours.value)
                    }}
                    tooltipIcon='QuestionCircle'
                    tooltipText='Show working hours in the year view.'
                  />
                </div>
              </Accordion.Body>
            </Accordion.Item>
          )}
          {!isMobileView && (
            <Accordion.Item>
              <Accordion.Header>{CalendarInterval.MONTH} View</Accordion.Header>
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
                  />
                </div>
              </Accordion.Body>
            </Accordion.Item>
          )}
          <Accordion.Item>
            <Accordion.Header>Other</Accordion.Header>
            <Accordion.Body>
              <div className='mt-2 flex flex-col space-y-2'>
                <Toggle
                  textToToggle={['Show week numbers', 'Hide week numbers']}
                  name={showWeekNumbers.cookieName}
                  preference={showWeekNumbers.value}
                  onChange={() => {
                    dispatch(setShowWeekNumbers(!showWeekNumbers.value))
                    setCookieMaxAge(showWeekNumbers.cookieName, !showWeekNumbers.value)
                  }}
                  tooltipIcon='QuestionCircle'
                  tooltipText='Show week numbers in the month, quarterly, 4-month, and year (classic) views.'
                />
              </div>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </div>
    </Modal>
  )
}
