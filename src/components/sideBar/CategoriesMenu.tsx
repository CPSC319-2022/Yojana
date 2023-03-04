import { Checkbox } from '@/components/common'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { getCategories, toggleCategory } from '@/redux/reducers/AppDataReducer'
import { CategoryState } from '@/types/prisma'
import { useSession } from 'next-auth/react'
import { useMemo, useState } from 'react'
import { CategoriesDropdown } from './CategoriesDropdown'

export const CategoriesMenu = () => {
  const session = useSession()
  const isAdmin = session && session.data?.user && session.data.user.isAdmin
  const dispatch = useAppDispatch()
  const categories: CategoryState[] = useAppSelector(getCategories)
  const [keepFocus, setKeepFocus] = useState(-1)
  const eventList = useMemo(() => {
    return categories.map((calEvent, key) => (
      <div
        className={`group mt-1 flex flex-row justify-between rounded-r-md  py-1 pr-2 hover:bg-slate-100 ${
          keepFocus === calEvent.id ? 'bg-slate-100' : ''
        }`}
        key={`category-item-${key}`}
      >
        <Checkbox
          icon={calEvent.icon}
          label={calEvent.name}
          id={`checkbox-${key}`}
          key={`checkbox-${key}`}
          color={calEvent.color}
          defaultChecked={calEvent.show}
          checkboxClassName={`h-5 w-5 ml-5`}
          onChange={() => dispatch(toggleCategory(calEvent.id))}
        />
        {isAdmin && (
          <CategoriesDropdown id={calEvent.id} setKeepFocus={setKeepFocus} keepOpen={keepFocus === calEvent.id} />
        )}
      </div>
    ))
  }, [categories, dispatch, keepFocus])
  return (
    <div className='mt-4'>
      <h3 className='truncate pl-5 text-lg'>Categories</h3>
      {eventList}
    </div>
  )
}
