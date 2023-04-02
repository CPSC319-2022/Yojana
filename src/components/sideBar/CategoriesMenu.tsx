import { Accordion, Checkbox, IconName } from '@/components/common'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { getCategories, getIsMobile, setCategoriesShow, toggleCategory } from '@/redux/reducers/AppDataReducer'
import { getIsSelectingDates } from '@/redux/reducers/DateSelectorReducer'
import { CategoryState } from '@/types/prisma'
import { Session } from 'next-auth'
import React, { useCallback, useState } from 'react'
import { CategoriesDropdown } from './CategoriesDropdown'

interface Props {
  session: Session
}

export const CategoriesMenu = ({ session }: Props) => {
  const dispatch = useAppDispatch()
  const categories: CategoryState[] = useAppSelector(getCategories)
  const [keepFocus, setKeepFocus] = useState(-1)
  const disable = useAppSelector(getIsSelectingDates)
  const isMobileView = useAppSelector(getIsMobile)

  const renderCategories = useCallback(
    (isMaster: boolean) => {
      return categories
        .filter((calEvent) => calEvent.isMaster === isMaster)
        .map((calEvent) => {
          return (
            <div
              className={`group mt-1 flex flex-row justify-between rounded-md py-1 px-2 ${
                !disable && 'hover:bg-slate-100'
              } ${keepFocus === calEvent.id ? 'bg-slate-100' : ''}`}
              key={`category-item-${calEvent.id}`}
              id={`category-item-${calEvent.id}`}
            >
              <Checkbox
                icon={calEvent.icon as IconName}
                label={calEvent.name}
                id={`checkbox-${calEvent.id}`}
                color={calEvent.color}
                checked={calEvent.show}
                checkboxClassName={`h-5 w-5 cursor-pointer`}
                onChange={() => dispatch(toggleCategory(calEvent.id))}
                iconClassName={`relative mb-1`}
              />
              {isMobileView || (isMaster && !session.user.isAdmin) ? null : (
                <CategoriesDropdown id={calEvent.id} setKeepFocus={setKeepFocus} keepOpen={keepFocus === calEvent.id} />
              )}
            </div>
          )
        })
    },
    [categories, disable, dispatch, isMobileView, keepFocus, session.user.isAdmin]
  )

  const renderCategoryType = useCallback(() => {
    const masterExists = categories.some((category) => category.isMaster)
    const personalExists = categories.some((category) => !category.isMaster)
    if (masterExists && personalExists) {
      return [true, false]
    } else if (masterExists) {
      return [true]
    } else if (personalExists) {
      return [false]
    }
    return []
  }, [categories])

  const renderAccordionItem = useCallback(
    (isMaster: boolean, key: number) => {
      const NumVisibleCategories = categories.filter(
        (category) => category.isMaster === isMaster && category.show
      ).length

      return (
        <Accordion.Item
          key={`category-type-${key}`}
          size='md'
          id={`${isMaster ? 'master' : 'personal'}-calendar-accordion-item`}
          secondIcon={NumVisibleCategories > 0 ? 'EyeSlashFill' : 'EyeFill'}
          secondIconOnClick={() => {
            dispatch(setCategoriesShow({ isMaster: isMaster, show: NumVisibleCategories === 0 }))
          }}
          secondIconId={`${isMaster ? 'master' : 'personal'}-toggle-all`}
        >
          <Accordion.Header>{isMaster ? 'Master Calendar' : 'Personal Calendar'}</Accordion.Header>
          <Accordion.Body>{renderCategories(isMaster)}</Accordion.Body>
        </Accordion.Item>
      )
    },
    [categories, dispatch, renderCategories]
  )

  return (
    <div className='pt-4'>
      <Accordion disable={disable}>
        {renderCategoryType().map((isMaster, key) => renderAccordionItem(isMaster, key))}
      </Accordion>
    </div>
  )
}
