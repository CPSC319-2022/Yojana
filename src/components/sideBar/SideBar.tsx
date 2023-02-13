import { CategoriesMenu } from './CategoriesMenu'
import { ReactElement } from 'react'
import { CreateCategoryModal } from '@/components/CreateCategoryModal'

export const SideBar = (): ReactElement => {
  return (
    <div className='pl-5'>
      <CreateCategoryModal />
      <CategoriesMenu />
    </div>
  )
}
