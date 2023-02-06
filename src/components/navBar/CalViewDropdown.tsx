import React, { ReactElement, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getInterval, setInterval } from '@/reducers/MainCalendarReducer'
import { CalendarInterval } from '@/constants/enums'

export const CalViewDropdown = (): ReactElement => {
  const dispatch = useDispatch()
  const activeCalView = useSelector(getInterval)

  const onSelect = (selectedKey: string) => {
    if (selectedKey !== activeCalView && selectedKey !== null) {
      dispatch(setInterval(selectedKey as CalendarInterval))
    }
  }

  const renderItems = useMemo(() => {
    return Object.values(CalendarInterval).map((view) => {
      return (
        <li key={view} onClick={() => onSelect(view)}>
          {view}
        </li>
      )
    })
  }, [activeCalView])

  return (
    <div id='calendar-view-menu' className='dropdown' title={activeCalView}>
      <label tabIndex={0} className='btn'>
        {activeCalView}
      </label>
      <ul tabIndex={0} className='dropdown-content menu rounded-box w-52 bg-base-100 p-2 shadow'>
        {renderItems}
      </ul>
    </div>
  )
}
