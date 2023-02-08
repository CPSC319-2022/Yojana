import { Checkbox } from '@/components/common'
import React, { ReactElement, useMemo } from 'react'
import { BsPencilSquare } from 'react-icons/bs'
import { getCategories } from '@/redux/reducers/AppDataReducer'
import { Category } from '@prisma/client'
import { getTextColor } from '@/utils/color'
import { useAppSelector } from '@/redux/hooks'

export const CategoriesMenu = (): ReactElement => {
  const categories: Category[] = useAppSelector(getCategories)

  const eventList = useMemo(() => {
    return categories.map((calEvent, key) => (
      <div
        className={`flex flex-row justify-between bg-[${calEvent.color}] mt-1 pr-2 pl-2 ${getTextColor(
          calEvent.color
        )}`}
        key={`category-item-${key}`}
      >
        <Checkbox label={calEvent.name} id={`checkbox-${key}`} key={`checkbox-${key}`} />
        <span className='mt-1 cursor-pointer'>
          <BsPencilSquare />
        </span>
      </div>
    ))
  }, [categories])

  return (
    <div>
      <h3 className='text-xl'>Categories</h3>
      {eventList}
    </div>
  )
}
