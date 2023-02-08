import React, { ReactElement, useEffect, useMemo, useState } from 'react'
import { Category } from '@/utils/types'
import { EventBlock } from './EventBlock'
import dayjs, { Dayjs } from 'dayjs'
import { Entry } from '@/utils/types/Category'

interface DayProps {
  categories: Category[]
  date: Dayjs
}

/**
 * A day in month view.
 */
export const Day = (props: DayProps): ReactElement => {
  const [categories, setCategories] = useState<Category[]>([])

  const filterCategoriesForDate = useMemo((): Category[] => {
    const dateString = `${props.date.format('YYYY-MM-DD')}T00:00:00.000Z`
    return props.categories
      .slice()
      .filter((cat) => cat.entries.find((entry: Entry) => dayjs(entry.date).toISOString() === dateString))
  }, [props.categories, props.date])
  useEffect(() => {
    setCategories(filterCategoriesForDate)
  }, [filterCategoriesForDate])

  const dayEvents = useMemo(() => {
    return categories.map((calEvent, key) => (
      <EventBlock color={calEvent.color} label={calEvent.name || ''} key={key} />
    ))
  }, [categories])

  return (
    <div className='tile overflow-y-auto bg-white'>
      <span>{props.date.date()}</span>
      {dayEvents}
    </div>
  )
}
