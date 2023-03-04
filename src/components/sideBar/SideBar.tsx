import { CategoryModal } from '@/components/CategoryModal'
import { CategoriesMenu } from './CategoriesMenu'
import { Year } from '@/components/mainCalendar/Year'
import { PrintButton } from '@/components/printCalendar/print'
import React, { useRef } from 'react'

export const SideBar = () => {
  const componentRef = useRef<HTMLDivElement>(null)

  return (
    <div className='pt-2'>
      <CategoryModal method='POST' id={-1} callBack={() => {}} />
      <CategoriesMenu />
      <span style={{ display: 'none' }}>
        <div ref={componentRef}>
          <Year />
          <CategoriesMenu />
        </div>
      </span>
      <PrintButton
        contentRef={componentRef}
        className='mt-4 ml-5 inline-flex justify-center truncate rounded-md border border-transparent bg-emerald-100 px-4 py-2 font-medium text-emerald-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 enabled:hover:bg-emerald-200 disabled:opacity-75'
      />
    </div>
  )
}
