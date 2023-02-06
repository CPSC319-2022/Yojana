import React, { ReactElement } from 'react'
import { CategoriesMenu } from '@/components/categoriesMenu'

interface NavBarProps {
  className: string
}

export const SideBar = (props: NavBarProps): ReactElement => {
  return (
    <div className={props.className}>
      <button className='btn'>Create</button>
      <CategoriesMenu />
    </div>
  )
}
