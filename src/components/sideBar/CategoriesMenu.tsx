import { Checkbox } from '@/components/common'
import { useAppSelector } from '@/redux/hooks'
import { getCategories } from '@/redux/reducers/AppDataReducer'
import { Category } from '@prisma/client'
import { ReactElement, useMemo } from 'react'
import { BsThreeDotsVertical } from 'react-icons/bs'

export const CategoriesMenu = (): ReactElement => {
  const categories: Category[] = useAppSelector(getCategories)

  const eventList = useMemo(() => {
    return categories.map((calEvent, key) => (
      <div
        className='group mt-1 flex flex-row justify-between rounded-md bg-white pr-2 hover:bg-slate-100'
        key={`category-item-${key}`}
      >
        <Checkbox
          label={`${calEvent.icon} ${calEvent.name}`}
          id={`checkbox-${key}`}
          key={`checkbox-${key}`}
          color={calEvent.color}
        />
        <span className='mt-1 cursor-pointer text-white group-hover:text-slate-500'>
          <BsThreeDotsVertical />
        </span>
      </div>
    ))
  }, [categories])

  return (
    <div className='mt-4'>
      <h3 className='text-lg'>Categories</h3>
      {eventList}
    </div>
  )
}
