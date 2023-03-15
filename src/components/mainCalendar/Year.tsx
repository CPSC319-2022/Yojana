import { Icon, IconName } from '@/components/common'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { getCategoryMap, getYear } from '@/redux/reducers/AppDataReducer'
import { getIsSelectingDates, getYearSelectedDates, toggleIndividualDate } from '@/redux/reducers/DateSelectorReducer'
import { getDate } from '@/redux/reducers/MainCalendarReducer'
import { getPreferences } from '@/redux/reducers/PreferencesReducer'
import dayjs, { Dayjs } from 'dayjs'
import { useCallback, useMemo } from 'react'

export const Year = ({ getForPrinting }: { getForPrinting: boolean }) => {
  const stateDate = useAppSelector(getDate)
  const categoryMap = useAppSelector(getCategoryMap)
  const entriesInYear = useAppSelector((state) => getYear(state, stateDate))
  const isSelectingDates = useAppSelector(getIsSelectingDates)
  const yearSelected = useAppSelector((state) => getYearSelectedDates(state, stateDate))
  const preferences = useAppSelector(getPreferences)

  const yearStartDate = dayjs().startOf('year')
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
                <Icon iconName={category.icon as IconName} className='inline' />
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
    (isWeekend: boolean, isToday: boolean, isSelected?: boolean, isRepeating?: boolean) => {
      if (!isSelectingDates) {
        return isWeekend ? 'bg-slate-100' : 'bg-white'
      } else {
        if (isWeekend && isSelected) {
          return isRepeating ? 'bg-slate-100' : 'bg-emerald-200'
        } else if (isSelected) {
          return isRepeating ? 'bg-slate-100' : 'bg-emerald-100'
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
      const backgroundColor = getDateBackgroundColour(isWeekend, isToday, selected?.isSelected, selected?.isRepeating)

      return (
        <div
          className={`tile px-0.5 
            ${backgroundColor} 
            ${isSelectingDates && !selected?.isRepeating ? 'cursor-pointer' : ''} 
            ${isSelectingDates && !selected?.isSelected ? 'hover:ring-2 hover:ring-inset hover:ring-emerald-200' : ''}
            ${!isSelectingDates && isToday ? 'ring-2 ring-inset ring-emerald-300' : ''}
            ${
              preferences.yearOverflow.value === 'expand' || getForPrinting
                ? 'inline-flow break-all'
                : 'flex overflow-x-scroll'
            }`}
          key={`${yearNum}-${monthNum}-${dateOffset}`}
          onClick={() => onDayClicked(day, !selected || !selected?.isRepeating)}
        >
          {renderDayCategories(day, monthNum)}
        </div>
      )
    },
    [
      getForPrinting,
      getDateBackgroundColour,
      isSelectingDates,
      onDayClicked,
      renderDayCategories,
      yearNum,
      yearSelected,
      yearStartDate,
      preferences.yearOverflow.value
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
        className={`box-border grid grow  divide-x divide-y border-b bg-slate-300 
        ${
          getForPrinting
            ? 'grid-cols-[3.25%_7.5%_7.5%_7.5%_7.5%_3.25%_7.5%_7.5%_7.5%_7.5%_3.25%_7.5%_7.5%_7.5%_7.5%]'
            : 'grid-cols-[2.5%_7.7%_7.7%_7.7%_7.7%_2.5%_7.7%_7.7%_7.7%_7.7%_2.5%_7.7%_7.7%_7.7%_7.7%]'
        }
        ${preferences.yearShowGrid.value || getForPrinting ? '' : 'divide-transparent'}`}
      >
        <>
          {monthHeaders}
          {days}
        </>
      </div>
    )
  }, [getForPrinting, days, preferences.yearShowGrid.value, monthHeaders])
  return <div className='grow bg-white'>{months}</div>
}
