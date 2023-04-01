import { Dropdown } from '@/components/common'
import { signOut } from 'next-auth/react'
import { useRef, useState } from 'react'
import { useAppSelector } from '@/redux/hooks'
import { CategoryState } from '@/types/prisma'
import { getCategories } from '@/redux/reducers/AppDataReducer'
import { PreferenceModal } from '@/components/PreferenceModal'
import { useReactToPrint } from 'react-to-print'
import ComponentToPrint from '@/components/navBar/ComponentToPrint'
import { Session } from 'next-auth'

/*
 * This is a dropdown menu that appears when the user clicks on 'account' in the navbar.
 * It provides the user options to change the preferences, export the calendar, print the calendar, and log out
 */
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
  const handlePrint = useReactToPrint({
    content: () => printComponentRef.current,
    pageStyle: `
      @page {
        size: A4;
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
        <Dropdown.Button label='Print Calendar' onClick={handlePrint} />
        <Dropdown.Button label='Logout' onClick={() => signOut()} />
      </Dropdown>
      <ComponentToPrint ref={printComponentRef} />
      <PreferenceModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
    </div>
  )
}
