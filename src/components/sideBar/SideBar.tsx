import { CategoryModal } from '@/components/CategoryModal'
import { Session } from 'next-auth'
import { CategoriesMenu } from './CategoriesMenu'
import { CsvModal } from '@/components/CsvModal'

interface Props {
  session: Session
}

export const SideBar = ({ session }: Props) => {
  return (
    <div className='mt-4 pt-2 pl-1'>
      <div className='flex flex-row px-4'>
        {session.user && <CategoryModal method='POST' id={-1} callBack={() => {}} />}
        <CsvModal />
      </div>
      <CategoriesMenu session={session} />
    </div>
  )
}
