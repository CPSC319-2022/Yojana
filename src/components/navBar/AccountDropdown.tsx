import { Dropdown } from '@/components/common'
import ComponentToPrint from '@/components/navBar/ComponentToPrint'
import { PreferenceModal } from '@/components/PreferenceModal'
import { useAppSelector } from '@/redux/hooks'
import { getCategories } from '@/redux/reducers/AppDataReducer'
import { CategoryState } from '@/types/prisma'
import { Session } from 'next-auth'
import { signOut } from 'next-auth/react'
import { useEffect, useRef, useState } from 'react'
import { useReactToPrint } from 'react-to-print'

export const AccountDropdown = ({ session }: { session: Session }) => {
  const userName = session?.user.name || ''
  const userID = session?.user.id || ''

  const [isModalOpen, setIsModalOpen] = useState(false)

  const categories: CategoryState[] = useAppSelector(getCategories)
  const categoriesWithShowTrue = categories
    .filter((category) => category.show)
    .map((category) => category.id)
    .join(',')

  const printComponentRef = useRef(null)
  const [selectedView, setSelectedView] = useState('Year')
  const [printTrigger, setPrintTrigger] = useState(false)

  useEffect(() => {
    if (printTrigger) {
      handlePrint()
    }
  }, [printTrigger, setPrintTrigger])

  const handlePrint = useReactToPrint({
    content: () => printComponentRef.current,
    onAfterPrint: () => setPrintTrigger(false),
    pageStyle: `
      @page {
        size: ${selectedView === 'YearScroll' ? 'A4 landscape' : 'A4'};
        margin: 0;
      }
      @media print {
        body {
          transform-origin: top left;
        }
      }
    `
  })

  return (
    <div id='account-dropdown'>
      <Dropdown text='Account' containerClassName='w-[12vw]'>
        <Dropdown.Button label={userName} onClick={() => {}} clickable={false} />
        <Dropdown.Divider />
        <Dropdown.Button label='Preferences' onClick={() => setIsModalOpen(true)} />
        <Dropdown.Accordion title='Export Calendar'>
          <Dropdown.Button
            label='Master Calendar'
            onClick={() => {
              window.open(`/api/dates/export?master=true`, '_blank')
            }}
          />
          <Dropdown.Button
            label='Personal Calendar'
            onClick={() => {
              window.open(`/api/dates/export?master=false&userID=${userID}`, '_blank')
            }}
          />
          <Dropdown.Button
            label='Filtered Categories'
            onClick={() => {
              window.open(`/api/dates/export?categories=${categoriesWithShowTrue}`, '_blank')
            }}
          />
        </Dropdown.Accordion>
        <Dropdown.Accordion title='Print Calendar'>
          <Dropdown.Button
            label='Print Year View'
            onClick={() => {
              setPrintTrigger(true)
              setSelectedView('Year')
            }}
          />
          <Dropdown.Button
            label='Print Year Scroll View'
            onClick={() => {
              setPrintTrigger(true)
              setSelectedView('YearScroll')
            }}
          />
        </Dropdown.Accordion>
        <Dropdown.Button label='Logout' onClick={() => signOut()} />
      </Dropdown>
      {printTrigger && <ComponentToPrint printType={selectedView} ref={printComponentRef} />}
      <PreferenceModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
    </div>
  )
}
