import { Checkbox } from '@/components/common'
import React, { ReactElement, useEffect, useMemo, useState } from 'react'
import styles from './CategoriesMenu.module.scss'
import { Category, EventWatcher } from '@/utils/calendar'
import { BsPencilSquare } from 'react-icons/bs'

export const CategoriesMenu = (): ReactElement => {
  const [events, setEvents] = useState<Category[]>([])

  // TODO this is a stub
  useEffect(() => {
    setEvents(EventWatcher.events)
  }, [])

  const eventList = useMemo(() => {
    return events.map((calEvent, key) => (
      <div className={styles.menuEntry} key={`category-item-${key}`}>
        <Checkbox
          color={calEvent.color}
          label={calEvent.categoryName}
          className={styles.checkBox}
          id={`checkbox-${key}`}
          key={`checkbox-${key}`}
        />
        <span>
          <BsPencilSquare />
        </span>
      </div>
    ))
  }, [events])

  return (
    <div className={styles.categoriesMenu}>
      <h3>Categories</h3>
      {eventList}
    </div>
  )
}
