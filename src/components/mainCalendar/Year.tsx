import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { getCategoryMap, getYear } from '@/redux/reducers/AppDataReducer'
import { getIsSelectingDates, getYearSelectedDates, toggleIndividualDate } from '@/redux/reducers/DateSelectorReducer'
import { getDate, getGridPreference, getYearPreference } from '@/redux/reducers/MainCalendarReducer'
import dayjs, { Dayjs } from 'dayjs'
import { useCallback, useMemo } from 'react'

export const Year = () => {
  const stateDate = useAppSelector(getDate)
  const categoryMap = useAppSelector(getCategoryMap)
  const entriesInYear = useAppSelector((state) => getYear(state, stateDate))
  const isSelectingDates = useAppSelector(getIsSelectingDates)
  const yearSelected = useAppSelector((state) => getYearSelectedDates(state, stateDate))
  const gridViewPref = useAppSelector(getGridPreference)
  const yearViewPref = useAppSelector(getYearPreference)

  const yearStartDate = dayjs(stateDate).startOf('year')
  const yearNum = yearStartDate.get('year')

  const dispatch = useAppDispatch()

  const renderDayCategories = useCallback(
    (day: Dayjs, monthNum: number) => {
      let icons: (JSX.Element | undefined)[] = []

      if (!isSelectingDates) {
        const entriesOnDay = entriesInYear?.[monthNum]?.[day.date()] ?? []
        icons = entriesOnDay.map((calEvent, key) => {
          const category = categoryMap[calEvent.categoryId]
          if (category.show) {
            return (
              <span className={'px-0.5 font-bold'} key={`${calEvent.id}-${key}`}>
                <style jsx>{`
                  * {
                    color: ${category.color};
                  }
                `}</style>
                {category.icon}
              </span>
            )
          }
        })
      }
      icons.push(<span key={`${monthNum}-${day.get('day')}`}>&nbsp;</span>)
      return icons
    },
    [categoryMap, entriesInYear, isSelectingDates]
  )

  const getDateBackgroundColour = useCallback(
    (isWeekend: boolean, isToday: boolean, isSelected?: boolean) => {
      if (!isSelectingDates) {
        return isWeekend ? 'bg-slate-100' : 'bg-white'
      } else {
        if (isWeekend && isSelected) {
          return 'bg-emerald-200'
        } else if (isWeekend) {
          return 'bg-slate-100'
        } else if (isSelected) {
          return 'bg-emerald-100'
        } else {
          return 'bg-white'
        }
      }
    },
    [isSelectingDates]
  )

  const onDayClicked = useCallback(
    (day: Dayjs, isNotSelectedNorRepeating: boolean) => {
      if (isNotSelectedNorRepeating) {
        dispatch(toggleIndividualDate(day))
      }
    },
    [dispatch]
  )

  const renderDay = useCallback(
    (monthNum: number, dateOffset: number) => {
      const monthStartDate = dayjs(yearStartDate).add(monthNum, 'month')
      if (monthStartDate.daysInMonth() <= dateOffset) {
        return <span key={`${yearNum}-${monthNum}-${dateOffset}`}>&nbsp;</span>
      }

      const day = monthStartDate.add(dateOffset, 'days')
      const isToday = day.isSame(dayjs(), 'day')
      const isWeekend = day.day() === 0 || day.day() === 6
      const selected = yearSelected?.[monthNum]?.[day.date()]
      const backgroundColor = getDateBackgroundColour(isWeekend, isToday, selected?.isSelected)

      return (
        <div
          className={`tile px-0.5 
            ${backgroundColor} 
            ${isSelectingDates && !selected?.isRepeating ? 'cursor-pointer' : ''} 
            ${!isSelectingDates && isToday ? 'shadow-[inset_0_0_1px_2px] shadow-emerald-300' : ''}
            ${yearViewPref ? 'inline-flow break-all' : 'flex overflow-x-scroll'}`}
          key={`${yearNum}-${monthNum}-${dateOffset}`}
          onClick={() => onDayClicked(day, !selected || !selected?.isRepeating)}
        >
          {renderDayCategories(day, monthNum)}
        </div>
      )
    },
    [
      getDateBackgroundColour,
      isSelectingDates,
      onDayClicked,
      renderDayCategories,
      yearNum,
      yearSelected,
      yearStartDate,
      yearViewPref
    ]
  )

  const monthHeaders = useMemo(() => {
    return Array.from(Array(15).keys()).map((columnNum) => {
      const monthNum = columnNum - Math.ceil(columnNum / 5)
      const monthStartDate = dayjs(yearStartDate).add(monthNum, 'month')
      return (
        <h3 className='sticky top-0 bg-slate-100 text-center text-slate-400' key={`col-${columnNum}-header`}>
          {columnNum % 5 === 0 ? '\u00A0' : monthStartDate.format('MMM')}
        </h3>
      )
    })
  }, [yearStartDate])

  const days = useMemo(() => {
    return Array.from(Array(31).keys()).map((dateNum) => {
      return Array.from(Array(15).keys()).map((columnNum) => {
        if (columnNum % 5 === 0) {
          return (
            <div className={'bg-white px-1'} key={`${columnNum}-${dateNum + 1}`}>
              {dateNum + 1}
            </div>
          )
        }

        const monthNum = columnNum - Math.ceil(columnNum / 5)
        return renderDay(monthNum, dateNum)
      })
    })
  }, [renderDay])

  const months = useMemo(() => {
    return (
      <div
        className={`box-border grid grow grid-cols-[2.5%_7.5%_7.5%_7.5%_7.5%_2.5%_7.5%_7.5%_7.5%_7.5%_2.5%_7.5%_7.5%_7.5%_7.5%] gap-x-0.5 
        ${gridViewPref ? 'divide-y divide-slate-300' : ''}`}
      >
        <>
          {monthHeaders}
          {days}
        </>
      </div>
    )
  }, [days, gridViewPref, monthHeaders])

  return <div className='grow bg-slate-300'>{months}</div>
}
