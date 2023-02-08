import { Checkbox } from '@/components/common'
import React, { ReactElement, useMemo } from 'react'
import { BsPencilSquare } from 'react-icons/bs'
import { getCategories } from '@/redux/reducers/AppDataReducer'
import { useSelector } from 'react-redux'
import { Category } from '@prisma/client'

export const CategoriesMenu = (): ReactElement => {
  const categories: Category[] = useSelector(getCategories)

  const eventList = useMemo(() => {
    return categories.map((calEvent, key) => (
      <div
        className={`flex flex-row justify-between bg-[${calEvent.color}] mt-1 pr-2 pl-2`}
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
