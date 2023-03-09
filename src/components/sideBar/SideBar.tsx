import { CategoryModal } from '@/components/CategoryModal'
import { Session } from 'next-auth'
import { CategoriesMenu } from './CategoriesMenu'
import { CsvModal } from '@/components/CsvModal'

interface Props {
  session: Session
}

export const SideBar = ({ session }: Props) => {
  return (
    <div className='pt-2'>
      {session.user.isAdmin && <CategoryModal method='POST' id={-1} callBack={() => {}} />}
      <CsvModal />
      <CategoriesMenu session={session} />
    </div>
  )
}
