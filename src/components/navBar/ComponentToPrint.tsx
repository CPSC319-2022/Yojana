import { useAppSelector } from '@/redux/hooks'
import { getCategories } from '@/redux/reducers/AppDataReducer'
import React from 'react'
import { getDate } from '@/redux/reducers/MainCalendarReducer'
import { Icon, IconName } from '@/components/common'
import { Year } from '@/components/mainCalendar/Year'

const ComponentToPrint = React.forwardRef<HTMLDivElement>((props, ref) => {
  const categories = useAppSelector(getCategories).filter((category) => category.show)
  const year = useAppSelector(getDate).year()

  let gridSize
  if (categories.length <= 12) {
    gridSize = 'grid-cols-3'
  } else if (categories.length <= 20) {
    gridSize = 'grid-cols-4'
  } else {
    gridSize = 'grid-cols-6'
  }

  return (
    <span className='relative hidden'>
      <div ref={ref} className='h-auto w-auto overflow-visible border'>
        <div className='pt-4'>
          <div className={`grid ${gridSize} gap-1 px-4`}>
            {categories.map((category) => (
              <div key={category.id} className='flex flex-row bg-white text-left'>
                <Icon iconName={category.icon as IconName} color={category.color} className='mr-2 inline' />
                <p>{category.name}</p>
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
