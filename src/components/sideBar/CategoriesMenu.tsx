import { Checkbox } from '@/components/common'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { getCategories, toggleCategory } from '@/redux/reducers/AppDataReducer'
import { CategoryState } from '@/types/prisma'
import { useMemo } from 'react'
import { CategoriesDropdown } from './CategoriesDropdown'
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
          checkboxClassName={`h-5 w-5 ml-5`}
          onChange={() => dispatch(toggleCategory(calEvent.id))}
        />
        <CategoriesDropdown id={calEvent.id} />
      </div>
    ))
  }, [categories, dispatch])

  return (
    <div className='mt-4'>
      <h3 className='truncate pl-5 text-lg'>Categories</h3>
      {eventList}
    </div>
  )
}
