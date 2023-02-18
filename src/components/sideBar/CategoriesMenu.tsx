import { Checkbox } from '@/components/common'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { getCategories, toggleCategory } from '@/redux/reducers/AppDataReducer'
import { useMemo } from 'react'
import { BsThreeDotsVertical } from 'react-icons/bs'
import { CategoryState } from '@/types/prisma'

export const CategoriesMenu = () => {
  const dispatch = useAppDispatch()
  const categories: CategoryState[] = useAppSelector(getCategories)

  const eventList = useMemo(() => {
    return categories.map((calEvent, key) => (
      <div
        className='group mt-1 flex flex-row justify-between rounded-r-md bg-white py-1 pr-2 hover:bg-slate-100'
        key={`category-item-${key}`}
      >
        <Checkbox
          label={`${calEvent.icon} ${calEvent.name}`}
          id={`checkbox-${key}`}
          key={`checkbox-${key}`}
          color={calEvent.color}
          defaultChecked={calEvent.show}
          checkboxClassName={`h-5 w-5`}
          wrapperClassName='pl-5 items-center'
          onChange={() => dispatch(toggleCategory(calEvent.id))}
        />
        <span className='mt-1 cursor-pointer text-white group-hover:text-slate-500'>
          <BsThreeDotsVertical />
        </span>
      </div>
    ))
  }, [categories, dispatch])

  return (
    <div className='mt-4'>
      <h3 className='pl-5 text-lg'>Categories</h3>
      {eventList}
    </div>
  )
}
