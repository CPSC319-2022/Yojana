import {Checkbox} from '@/components/common'
import React, {ReactElement, useEffect, useMemo, useState } from 'react'
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
      <div className={`flex-row flex justify-between bg-[#${calEvent.color}] mt-1`} key={`category-item-${key}`}>
        <Checkbox color={calEvent.color} label={calEvent.categoryName} id={`checkbox-${key}`} key={`checkbox-${key}`} />
      <span className="mr-2 cursor-pointer">
          <BsPencilSquare />
        </span>
      </div>
    ))
  }, [events])

  return (
    <div>
      <h3 className='text-xl'>Categories</h3>
      {eventList}
    </div>
  )
}
