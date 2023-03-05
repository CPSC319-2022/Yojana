import { CategoryModal } from '@/components/CategoryModal'
import { Session } from 'next-auth'
import { CategoriesMenu } from './CategoriesMenu'

interface Props {
  session: Session
}

export const SideBar = ({ session }: Props) => {
  return (
    <div className='pt-2'>
      {session.user.isAdmin && <CategoryModal method='POST' id={-1} callBack={() => {}} />}
      <CategoriesMenu session={session} />
    </div>
  )
}
