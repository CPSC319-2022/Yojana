import { CategoriesMenu } from './CategoriesMenu'
import { CreateCategoryModal } from '@/components/CreateCategoryModal'

export const SideBar = () => {
  return (
    <>
      <CreateCategoryModal />
      <CategoriesMenu />
    </>
  )
}
