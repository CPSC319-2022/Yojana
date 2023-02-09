import React, { ReactElement, useCallback, useEffect, useMemo } from 'react'
import { getInterval, setInterval } from '@/redux/reducers/MainCalendarReducer'
import { CalendarInterval } from '@/constants/enums'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'

export const CalViewDropdown = (): ReactElement => {
  const dispatch = useAppDispatch()
  const activeCalView = useAppSelector(getInterval)

  const onSelect = useCallback(
    (selectedKey: string) => {
      if (selectedKey !== activeCalView && Object.values(CalendarInterval).includes(selectedKey as any)) {
        dispatch(setInterval(selectedKey as CalendarInterval))
      }
    },
    [activeCalView, dispatch]
  )

  useEffect(() => {
    const localStorageValue = localStorage.getItem('CalendarInterval')
    if (localStorageValue) {
      onSelect(localStorageValue)
    }
  }, []) // deliberately empty, is initialization code

  const renderItems = useMemo(() => {
    return Object.values(CalendarInterval).map((view) => {
      return (
        <li key={view} onClick={() => onSelect(view)} className='p-2 hover:bg-gray-500'>
          {view}
        </li>
      )
    })
  }, [onSelect])

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
