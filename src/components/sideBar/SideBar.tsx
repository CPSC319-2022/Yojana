import { CategoryModal } from '@/components/CategoryModal'
import { useSession } from 'next-auth/react'
import { CategoriesMenu } from './CategoriesMenu'

export const SideBar = () => {
  const session = useSession()
  const isAdmin = session && session.data?.user && session.data.user.isAdmin
  return (
    <div className='pt-2'>
      {isAdmin && <CategoryModal method='POST' id={-1} callBack={() => {}} />}
      <CategoriesMenu />
    </div>
  )
}
