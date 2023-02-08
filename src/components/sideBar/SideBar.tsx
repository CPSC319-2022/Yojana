import React, { ReactElement } from 'react'
import { CategoriesMenu } from '@/components/categoriesMenu'
import { Category } from '@/utils/types'

interface NavBarProps {
  categories: Category[]
}

export const SideBar = (props: NavBarProps): ReactElement => {
  return (
    <div>
      <button className='btn'>Create</button>
      <CategoriesMenu categories={props.categories} />
    </div>
  )
}
