import { CategoriesMenu } from './CategoriesMenu'
import { ReactElement } from 'react'
import { CreateCategoryModal } from '@/components/CreateCategoryModal'

export const SideBar = (): ReactElement => {
  return (
    <>
      <CreateCategoryModal />
      <CategoriesMenu />
    </>
  )
}
