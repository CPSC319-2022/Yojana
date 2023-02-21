import { CategoriesMenu } from './CategoriesMenu'
import { CreateCategoryModal } from '@/components/CreateCategoryModal'

export const SideBar = () => {
  return (
    <div className='p-2 pl-0'>
      <CreateCategoryModal />
      <CategoriesMenu />
    </div>
  )
}
