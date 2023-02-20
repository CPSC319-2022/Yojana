import { CategoriesMenu } from './CategoriesMenu'
import { CreateCategoryModal } from '@/components/CreateCategoryModal'
import { CsvModal } from '@/components/CsvModal'

export const SideBar = () => {
  return (
    <>
      <CreateCategoryModal />
      <CsvModal />
      <CategoriesMenu />
    </>
  )
}
