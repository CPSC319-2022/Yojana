import { Accordion, Checkbox, IconName } from '@/components/common'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { getCategories, toggleCategory } from '@/redux/reducers/AppDataReducer'
import { getCategoryInfo, getIsSelectingDates } from '@/redux/reducers/DateSelectorReducer'
import { CategoryState } from '@/types/prisma'
import { Session } from 'next-auth'
import { useCallback, useMemo, useState } from 'react'
import { CategoriesDropdown } from './CategoriesDropdown'

interface Props {
  session: Session
}

export const CategoriesMenu = ({ session }: Props) => {
  const dispatch = useAppDispatch()
  const categories: CategoryState[] = useAppSelector(getCategories)
  const [keepFocus, setKeepFocus] = useState(-1)
  const isSelectingDates = useAppSelector(getIsSelectingDates)
  const dateSelectCategory = useAppSelector(getCategoryInfo)

  const renderCategories = useCallback(
    (isMaster: boolean) => {
      return categories
        .filter((calEvent) => {
          return isSelectingDates ? calEvent.id === dateSelectCategory?.id : calEvent.isMaster === isMaster
        })
        .map((calEvent) => {
          return (
            <div
              className={`group mt-1 flex flex-row justify-between rounded-md py-1 px-2 ${
                !isSelectingDates && 'hover:bg-slate-100'
              } ${keepFocus === calEvent.id ? 'bg-slate-100' : ''}`}
              key={`category-item-${calEvent.id}`}
              id={`category-item-${calEvent.id}`}
            >
              <Checkbox
                icon={calEvent.icon as IconName}
                label={calEvent.name}
                id={`checkbox-${calEvent.id}`}
                color={calEvent.color}
                defaultChecked={calEvent.show}
                checkboxClassName={`h-5 w-5 cursor-pointer`}
                onChange={() => dispatch(toggleCategory(calEvent.id))}
                iconClassName={`relative mb-1`}
              />
              {isMaster && !session.user.isAdmin ? null : (
                <CategoriesDropdown id={calEvent.id} setKeepFocus={setKeepFocus} keepOpen={keepFocus === calEvent.id} />
              )}
            </div>
          )
        })
    },
    [categories, isSelectingDates, dateSelectCategory?.id, keepFocus, session.user.isAdmin, dispatch]
  )

  const renderCategoryType = useCallback(() => {
    const masterExists = categories.some((category) => category.isMaster)
    const personalExists = categories.some((category) => !category.isMaster)
    const selectingMasterCatDates = !isSelectingDates || dateSelectCategory?.isMaster === true
    const selectingPersonalCatDates = !isSelectingDates || dateSelectCategory?.isMaster === false

    const accordionGroups = []
    if ((masterExists && !isSelectingDates) || selectingMasterCatDates) accordionGroups.push(true)
    if ((personalExists && !isSelectingDates) || selectingPersonalCatDates) accordionGroups.push(false)
    return accordionGroups
  }, [categories, dateSelectCategory?.isMaster, isSelectingDates])

  const renderMenuContent = useMemo(() => {
    return (
      <Accordion>
        {renderCategoryType().map((categoryType, key) => {
          return (
            <Accordion.Item
              key={`category-type-${key}`}
              size='md'
              id={`${categoryType ? 'master' : 'personal'}-calendar-accordion-item`}
            >
              <Accordion.Header>{categoryType ? 'Master Calendar' : 'Personal Calendar'}</Accordion.Header>
              <Accordion.Body>{renderCategories(categoryType)}</Accordion.Body>
            </Accordion.Item>
          )
        })}
      </Accordion>
    )
  }, [renderCategories, renderCategoryType])

  return <div className='pt-4'>{renderMenuContent}</div>
}
