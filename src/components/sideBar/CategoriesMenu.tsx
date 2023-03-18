import { Accordion, Checkbox, IconName } from '@/components/common'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { getCategories, toggleCategory } from '@/redux/reducers/AppDataReducer'
import { getIsSelectingDates } from '@/redux/reducers/DateSelectorReducer'
import { CategoryState } from '@/types/prisma'
import { Session } from 'next-auth'
import { useCallback, useState } from 'react'
import { CategoriesDropdown } from './CategoriesDropdown'

interface Props {
  session: Session
}

export const CategoriesMenu = ({ session }: Props) => {
  const dispatch = useAppDispatch()
  const categories: CategoryState[] = useAppSelector(getCategories)
  const [keepFocus, setKeepFocus] = useState(-1)
  const disable = useAppSelector(getIsSelectingDates)

  const renderCategories = useCallback(
    (isMaster: boolean) => {
      return categories
        .filter((calEvent) => calEvent.isMaster === isMaster)
        .map((calEvent, key) => {
          return (
            <div
              className={`group mt-1 flex flex-row justify-between rounded-md py-1 px-2 ${
                !disable && 'hover:bg-slate-100'
              } ${keepFocus === calEvent.id ? 'bg-slate-100' : ''}`}
              key={`category-item-${key}`}
              id={`category-item-${calEvent.name}`}
            >
              <Checkbox
                icon={calEvent.icon as IconName}
                label={calEvent.name}
                id={`checkbox-${key}`}
                key={`checkbox-${key}`}
                color={calEvent.color}
                defaultChecked={calEvent.show}
                checkboxClassName={`h-5 w-5`}
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
    [categories, disable, dispatch, keepFocus, session.user.isAdmin]
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

  return (
    <div style={{ marginTop: '20px' }}>
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
    </div>
  )
}
