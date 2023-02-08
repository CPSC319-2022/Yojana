import React, { ReactElement } from 'react'
import { CategoriesMenu } from '@/components/categoriesMenu'

export const SideBar = (): ReactElement => {
  return (
    <div>
      <button className='btn'>Create</button>
      <CategoriesMenu />
    </div>
  )
}
