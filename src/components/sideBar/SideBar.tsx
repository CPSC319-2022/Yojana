import { CategoryModal } from '@/components/CategoryModal'
import { CategoriesMenu } from './CategoriesMenu'

import { CsvModal } from '@/components/CsvModal'

export const SideBar = () => {
  return (
    <div className='pt-2'>
      <CategoryModal method='POST' id={-1} callBack={() => {}} />
      <CsvModal />
      <CategoriesMenu />
    </div>
  )
}
