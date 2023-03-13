import { CategoryModal } from '@/components/CategoryModal'
import { Icon } from '@/components/common'
import { CsvModal } from '@/components/CsvModal'
import { Year } from '@/components/mainCalendar/Year'
import { PrintButton } from '@/components/printCalendar/print'
import { getCategories } from '@/redux/reducers/AppDataReducer'
import { Session } from 'next-auth'
import { useRef } from 'react'
import { CategoriesMenu } from './CategoriesMenu'
import { useAppSelector } from '@/redux/hooks'

interface Props {
  session: Session
}

export const SideBar = ({ session }: Props) => {
  const categories = useAppSelector(getCategories)

  const componentRef = useRef<HTMLDivElement>(null)

  interface Props {
    session: Session
  }

  return (
    <div className='mt-4 pt-2 pl-1'>
      <div className='flex flex-row px-4'>
        {session.user.isAdmin && <CategoryModal method='POST' id={-1} callBack={() => {}} />}
        <CsvModal />
      </div>
      <CategoriesMenu session={session} />
      <span style={{ display: 'none' }}>
        <div ref={componentRef} className='print-content'>
          <Year />
          <div className={'center'}>Categories</div>
          <div className='category-grid'>
            {categories.map((category) => (
              <div key={category.id} className='category-card'>
                <Icon iconName={category.icon} color={category.color} className='inline' />
                <div className='category-name'>{category.name}</div>
              </div>
            ))}
          </div>
        </div>
      </span>
      <PrintButton
        contentRef={componentRef}
        className='mt-4 ml-5 inline-flex justify-center truncate rounded-md border border-transparent bg-emerald-100 px-4 py-2 font-medium text-emerald-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 enabled:hover:bg-emerald-200 disabled:opacity-75'
      />
    </div>
  )
}
