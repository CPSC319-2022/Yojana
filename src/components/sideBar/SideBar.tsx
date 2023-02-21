import { CategoriesMenu } from './CategoriesMenu'
import { CreateCategoryModal } from '@/components/CreateCategoryModal'

export const SideBar = () => {
  return (
    <div className='p-2 pl-5'>
      <CreateCategoryModal />
      <CategoriesMenu />
    </div>
  )
}
