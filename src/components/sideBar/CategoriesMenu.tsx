import { Accordion, Checkbox, IconName } from '@/components/common'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { getCategories, toggleCategory } from '@/redux/reducers/AppDataReducer'
import { getIsSelectingDates } from '@/redux/reducers/DateSelectorReducer'
import { CategoryState } from '@/types/prisma'
import { Session } from 'next-auth'
import { useMemo, useState } from 'react'
import { CategoriesDropdown } from './CategoriesDropdown'

interface Props {
  session: Session
}

export const CategoriesMenu = ({ session }: Props) => {
  const dispatch = useAppDispatch()
  const categories: CategoryState[] = useAppSelector(getCategories)
  const [keepFocus, setKeepFocus] = useState(-1)
  const disable = useAppSelector(getIsSelectingDates)

  return (
    <div style={{ marginTop: '20px' }}>
      <Accordion>
        <Accordion.Item>
          <Accordion.Header>Admin Categories</Accordion.Header>
          <Accordion.Body>
            {categories.map((calEvent, key) => {
              if (calEvent.isMaster) {
                return (
                  <div
                    className={`group mt-1 flex flex-row justify-between rounded-r-md py-1 pr-2 ${
                      !disable && 'hover:bg-slate-100'
                    } ${keepFocus === calEvent.id ? 'bg-slate-100' : ''}`}
                    key={`category-item-${key}`}
                    id={`category-item-${key}`}
                  >
                    <Checkbox
                      icon={calEvent.icon as IconName}
                      label={calEvent.name}
                      id={`checkbox-${key}`}
                      key={`checkbox-${key}`}
                      color={calEvent.color}
                      defaultChecked={calEvent.show}
                      checkboxClassName={`h-5 w-5 ml-5`}
                      onChange={() => dispatch(toggleCategory(calEvent.id))}
                    />
                    {session.user.isAdmin && (
                      <CategoriesDropdown
                        id={calEvent.id}
                        setKeepFocus={setKeepFocus}
                        keepOpen={keepFocus === calEvent.id}
                      />
                    )}
                  </div>
                )
              }
              return null
            })}
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item>
          <Accordion.Header>User Categories</Accordion.Header>
          <Accordion.Body>
            {categories.map((calEvent, key) => {
              if (!calEvent.isMaster) {
                return (
                  <div
                    className={`group mt-1 flex flex-row justify-between rounded-r-md py-1 pr-2 ${
                      !disable && 'hover:bg-slate-100'
                    } ${keepFocus === calEvent.id ? 'bg-slate-100' : ''}`}
                    key={`category-item-${key}`}
                    id={`category-item-${key}`}
                  >
                    <Checkbox
                      icon={calEvent.icon as IconName}
                      label={calEvent.name}
                      id={`checkbox-${key}`}
                      key={`checkbox-${key}`}
                      color={calEvent.color}
                      defaultChecked={calEvent.show}
                      checkboxClassName={`h-5 w-5 ml-5`}
                      onChange={() => dispatch(toggleCategory(calEvent.id))}
                    />
                    {session.user.isAdmin && (
                      <CategoriesDropdown
                        id={calEvent.id}
                        setKeepFocus={setKeepFocus}
                        keepOpen={keepFocus === calEvent.id}
                      />
                    )}
                  </div>
                )
              }
              return null
            })}
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </div>
  )
}

/*

  const eventList = useMemo(() => {
    return (
        <Accordion>
            <Accordion.Header>
                <button className="text-blue-500 focus:outline-none">All Categories</button>
            </Accordion.Header>
            <Accordion.Body>
          {categories.map((calEvent, key) => (
              <Accordion.Item key={`category-item-${key}`}>
                <div
                    className={`group mt-1 flex flex-row justify-between rounded-r-md  py-1 pr-2 
            ${!disable && 'hover:bg-slate-100'} 
            ${keepFocus === calEvent.id ? 'bg-slate-100' : ''}`}
                    id={`category-item-${key}`}
                >
                  <Checkbox
                      icon={calEvent.icon as IconName}
                      label={calEvent.name}
                      id={`checkbox-${key}`}
                      key={`checkbox-${key}`}
                      color={calEvent.color}
                      defaultChecked={calEvent.show}
                      checkboxClassName={`h-5 w-5 ml-5`}
                      onChange={() => dispatch(toggleCategory(calEvent.id))}
                  />
                  {session.user.isAdmin && (
                      <CategoriesDropdown id={calEvent.id} setKeepFocus={setKeepFocus} keepOpen={keepFocus === calEvent.id} />
                  )}
                </div>
                {calEvent.isMaster && <p>This category is a master category</p>}

              </Accordion.Item>
          ))}
            </Accordion.Body>
        </Accordion>
    )
  }, [categories, disable, dispatch, keepFocus, session.user.isAdmin]);

    return (
        <div className='mt-4'>
            <h3 className='truncate pl-5 text-lg'>Categories</h3>
            {eventList}
        </div>
    )
     */

/*
import { Checkbox, IconName } from '@/components/common'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { getCategories, toggleCategory } from '@/redux/reducers/AppDataReducer'
import { getIsSelectingDates } from '@/redux/reducers/DateSelectorReducer'
import { CategoryState } from '@/types/prisma'
import { Session } from 'next-auth'
import { useMemo, useState } from 'react'
import { CategoriesDropdown } from './CategoriesDropdown'

interface Props {
    session: Session
}

export const CategoriesMenu = ({ session }: Props) => {
    const dispatch = useAppDispatch()
    const categories: CategoryState[] = useAppSelector(getCategories)
    const [keepFocus, setKeepFocus] = useState(-1)
    const disable = useAppSelector(getIsSelectingDates)
    let test = false

    if(session.user.isAdmin)
    {
        test = true
    }

    const adminCategories = useMemo(() => {
        return categories
            .filter((category) => (category.creatorId === session.user.id && test == true) || (category.creatorId !== session.user.id && test == false)) // filter by admin creatorId
            .map((calEvent, key) => (
                <div
                    className={`group mt-1 flex flex-row justify-between rounded-r-md  py-1 pr-2 
          ${!disable && 'hover:bg-slate-100'} 
          ${keepFocus === calEvent.id ? 'bg-slate-100' : ''}`}
                    key={`category-item-${key}`}
                    id={`category-item-${key}`}
                >
                    <Checkbox
                        icon={calEvent.icon as IconName}
                        label={calEvent.name}
                        id={`checkbox-${key}`}
                        key={`checkbox-${key}`}
                        color={calEvent.color}
                        defaultChecked={calEvent.show}
                        checkboxClassName={`h-5 w-5 ml-5`}
                        onChange={() => dispatch(toggleCategory(calEvent.id))}
                    />
                    <CategoriesDropdown id={calEvent.id} setKeepFocus={setKeepFocus}
                                        keepOpen={keepFocus === calEvent.id}/>
                </div>
            ))
    }, [categories, disable, dispatch, keepFocus, session.user.id])

    const otherCategories = useMemo(() => {
        return categories
            .filter((category) => (category.creatorId !== session.user.id && test == true) || (category.creatorId === session.user.id && test == false)) // filter by non-admin creatorId
            .map((calEvent, key) => (
                <div
                    className={`group mt-1 flex flex-row justify-between rounded-r-md  py-1 pr-2 
          ${!disable && 'hover:bg-slate-100'} 
          ${keepFocus === calEvent.id ? 'bg-slate-100' : ''}`}
                    key={`category-item-${key}`}
                    id={`category-item-${key}`}
                >
                    <Checkbox
                        icon={calEvent.icon as IconName}
                        label={calEvent.name}
                        id={`checkbox-${key}`}
                        key={`checkbox-${key}`}
                        color={calEvent.color}
                        defaultChecked={calEvent.show}
                        checkboxClassName={`h-5 w-5 ml-5`}
                        onChange={() => dispatch(toggleCategory(calEvent.id))}
                    />
                    <CategoriesDropdown id={calEvent.id} setKeepFocus={setKeepFocus}
                                        keepOpen={keepFocus === calEvent.id}/>
                </div>
            ))
    }, [categories, disable, dispatch, keepFocus, session.user.id])

    return (
        <div className='mt-4'>
            <h3 className='truncate pl-5 text-lg'>Admin Categories</h3>
            {adminCategories}
            <div className='mt-4'>
                <h3 className='truncate pl-5 text-lg'>User Categories</h3>
                {otherCategories}
            </div>
        </div>

    )
}
*/
