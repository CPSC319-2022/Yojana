import { useAppSelector } from '@/redux/hooks'
import { getCategories } from '@/redux/reducers/AppDataReducer'
import React from 'react'
import { getDate } from '@/redux/reducers/MainCalendarReducer'
import { Icon, IconName } from '@/components/common'
import { Year } from '@/components/mainCalendar/Year'

const ComponentToPrint = React.forwardRef<HTMLDivElement>((props, ref) => {
  const categories = useAppSelector(getCategories)
  const year = useAppSelector(getDate).year()

  return (
    <span style={{ display: 'none' }}>
      <div ref={ref} className='mx-2 h-auto w-auto overflow-visible border'>
        <div className='my-[1%] ml-[45%] font-[bolder]'>Categories</div>
        <div className='grid grid-cols-[repeat(6,1fr)] gap-1'>
          {categories.map(
            (category) =>
              category.show && (
                <div key={category.id} className='bg-white text-center'>
                  <Icon iconName={category.icon as IconName} color={category.color} className='inline' />
                  <div>{category.name}</div>
                </div>
              )
          )}
        </div>
        <div style={{ marginTop: '5px', fontSize: '28px' }} className='text-center font-bold'>
          {year}
        </div>
        <Year getForPrinting={true} />
      </div>
    </span>
  )
})
ComponentToPrint.displayName = 'ComponentToPrint'

export default ComponentToPrint
