import { CategoryModal } from '@/components/CategoryModal'
import { Session } from 'next-auth'
import { CategoriesMenu } from './CategoriesMenu'
import { CsvModal } from '@/components/CsvModal'
import { useAppSelector } from '@/redux/hooks'
import { getIsMobile } from '@/redux/reducers/AppDataReducer'
import { AccountDropdown } from '@/components/navBar/AccountDropdown'
import React from 'react'

interface Props {
  session: Session
}

export const SideBar = ({ session }: Props) => {
  const isMobileView = useAppSelector(getIsMobile)

  return (
    <div className='box-border h-full overflow-y-auto overflow-x-visible pt-6 pl-1 pr-2' id='sidebar'>
      {isMobileView ? (
        <AccountDropdown session={session} className={'w-full'} />
      ) : (
        <div className='flex flex-row px-4'>
          <CategoryModal method='POST' id={-1} callBack={() => {}} />
          <CsvModal />
        </div>
      )}
      <CategoriesMenu session={session} />
    </div>
  )
}
