import { CategoriesMenu } from './CategoriesMenu'
import { CreateCategoryModal } from '@/components/CreateCategoryModal'

export const SideBar = () => {
  return (
    <div className='pt-2'>
      <CreateCategoryModal />
      <CategoriesMenu />
    </div>
  )
}
