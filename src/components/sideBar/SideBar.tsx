import { CategoryModal } from '@/components/CategoryModal'
import { Icon } from '@/components/common'
import { CsvModal } from '@/components/CsvModal'
import { Year } from '@/components/mainCalendar/Year'
import { PrintButton } from '@/components/printCalendar/print'
import { useAppSelector } from '@/redux/hooks'
import { getCategories } from '@/redux/reducers/AppDataReducer'
import { Session } from 'next-auth'
import { useRef } from 'react'
import { CategoriesMenu } from './CategoriesMenu'
import { yearNum } from '@/components/mainCalendar/Year'

interface Props {
  session: Session
}

export const SideBar = ({ session }: Props) => {
  const categories = useAppSelector(getCategories)

  const componentRef = useRef<HTMLDivElement>(null)

  return (
    <div className='mt-4 pt-2 pl-1'>
      <div className='flex flex-row px-4'>
        {session.user.isAdmin && <CategoryModal method='POST' id={-1} callBack={() => {}} />}
        <CsvModal />
        <span style={{ display: 'none' }}>
          <div ref={componentRef} className='mx-2 h-auto w-auto overflow-visible border'>
            <div className='my-[2%] ml-[45%] font-[bolder]'>Categories</div>
            <div className='grid grid-cols-[repeat(6,1fr)] gap-4'>
              {categories.map(
                (category) =>
                  category.show && (
                    <div key={category.id} className='bg-white text-center'>
                      <Icon iconName={category.icon} color={category.color} className='inline' />
                      <div>{category.name}</div>
                    </div>
                  )
              )}
            </div>
            <div style={{ marginTop: '10px', fontSize: '28px' }} className='text-center font-bold'>
              {yearNum}
            </div>
            <Year getForPrinting={true} />
          </div>
        </span>
        <PrintButton
          contentRef={componentRef}
          className='ml-3 inline-flex justify-center rounded-md border border-transparent bg-emerald-100 px-4 py-2 font-medium text-emerald-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 enabled:hover:bg-emerald-200 disabled:opacity-75'
        />
      </div>
      <CategoriesMenu session={session} />
    </div>
  )
}
