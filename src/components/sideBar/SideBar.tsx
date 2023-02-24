import { CategoryModal } from '@/components/CategoryModal'
import { CategoriesMenu } from './CategoriesMenu'

export const SideBar = () => {
  return (
    <div className='pt-2'>
      <CategoryModal method='POST' id={-1} callBack={() => {}} />
      <CategoriesMenu />
    </div>
  )
}
