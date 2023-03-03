import { CategoryModal } from '@/components/CategoryModal'
import { CategoriesMenu } from './CategoriesMenu'

import { CsvModal } from '@/components/CsvModal'

export const SideBar = () => {
  return (
    <div className='mt-4 pt-2 pl-1'>
      <div className='flex flex-row px-4'>
        <CategoryModal method='POST' id={-1} callBack={() => {}} />
        <CsvModal />
      </div>
      <CategoriesMenu />
    </div>
  )
}
