import { useAppSelector } from '@/redux/hooks'
import { getCategories } from '@/redux/reducers/AppDataReducer'
import React from 'react'
import { getDate } from '@/redux/reducers/MainCalendarReducer'
import { Icon, IconName } from '@/components/common'
import { Year } from '@/components/mainCalendar/Year'

const ComponentToPrint = React.forwardRef<HTMLDivElement>((props, ref) => {
  const categories = useAppSelector(getCategories).filter((category) => category.show)
  const year = useAppSelector(getDate).year()

  return (
    <span className='relative hidden'>
      <div ref={ref} className='h-auto w-auto overflow-visible border'>
        <div className='absolute bottom-0 left-0 right-0 pb-2'>
          <div className='grid grid-cols-[repeat(6,1fr)] gap-1 px-4'>
            {categories.map((category) => (
              <div key={category.id} className='bg-white text-left'>
                <Icon iconName={category.icon as IconName} color={category.color} className='mr-2 inline' />
                {category.name}
              </div>
            ))}
          </div>
          <div className='mt-3 pb-3 text-center text-2xl font-bold'>{year}</div>
          <Year getForPrinting={true} />
        </div>
      </div>
    </span>
  )
})
ComponentToPrint.displayName = 'ComponentToPrint'

export default ComponentToPrint
