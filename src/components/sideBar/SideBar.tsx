import { CategoryModal } from '@/components/CategoryModal'
import { Session } from 'next-auth'
import { CategoriesMenu } from './CategoriesMenu'
import { CsvModal } from '@/components/CsvModal'

interface Props {
  session: Session
}

/**
 * SideBar is responsible for rendering the sidebar.
 * It contains the following:
 * 1. Categories Menu - Responsible for rendering the categories menu.
 * 2. Create Category Button - Responsible for rendering the modal to create categories.
 * 3. Import Entries Button - Responsible for rendering the modal to import csv file.
 *
 * @param session
 * @returns {JSX.Element}
 */
export const SideBar = ({ session }: Props) => {
  return (
    <div className='box-border h-full overflow-y-auto overflow-x-visible pt-6 pl-1 pr-2' id='sidebar'>
      <div className='flex flex-row px-4'>
        <CategoryModal method='POST' id={-1} callBack={() => {}} />
        <CsvModal />
      </div>
      <CategoriesMenu session={session} />
    </div>
  )
}
