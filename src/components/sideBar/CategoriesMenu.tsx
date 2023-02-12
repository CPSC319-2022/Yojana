import { Checkbox } from '@/components/common'
import { useAppSelector } from '@/redux/hooks'
import { getCategories } from '@/redux/reducers/AppDataReducer'
import { getTextColor } from '@/utils/color'
import { Category } from '@prisma/client'
import { ReactElement, useMemo } from 'react'
import { BsPencilSquare } from 'react-icons/bs'

export const CategoriesMenu = (): ReactElement => {
  const categories: Category[] = useAppSelector(getCategories)

  const eventList = useMemo(() => {
    return categories.map((calEvent, key) => (
      <div
        className={`mt-1 flex flex-row  justify-between pr-2 pl-2 `}
        key={`category-item-${key}`}
        //style={{ background: calEvent.color }}
        style={{ background: 'white' }}
      >
        <Checkbox
          label={`${calEvent.icon} ${calEvent.name}`}
          id={`checkbox-${key}`}
          key={`checkbox-${key}`}
          color={`checkbox-${calEvent.color}`}
        />
        <span className='mt-1 cursor-pointer'>
          <BsPencilSquare />
        </span>
      </div>
    ))
  }, [categories])

  return (
    <div className='mt-4'>
      <h3 className='text-xl'>Categories</h3>
      {eventList}
    </div>
  )
}
