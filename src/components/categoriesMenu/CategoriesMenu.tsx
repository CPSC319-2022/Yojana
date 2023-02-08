import { Checkbox } from '@/components/common'
import React, { ReactElement, useMemo } from 'react'
import { Category } from '@/types/Category'
import { BsPencilSquare } from 'react-icons/bs'

interface CategoriesMenuProps {
  categories: Category[]
}

export const CategoriesMenu = (props: CategoriesMenuProps): ReactElement => {
  const eventList = useMemo(() => {
    return props.categories?.map((calEvent, key) => (
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
  }, [props.categories])

  return (
    <div>
      <h3 className='text-xl'>Categories</h3>
      {eventList}
    </div>
  )
}
