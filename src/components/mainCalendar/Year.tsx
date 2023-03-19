import { Icon, IconName } from '@/components/common'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { getCategoryMap, getYear } from '@/redux/reducers/AppDataReducer'
import { getIsSelectingDates, getYearSelectedDates, toggleIndividualDate } from '@/redux/reducers/DateSelectorReducer'
import { getDate } from '@/redux/reducers/MainCalendarReducer'
import { getPreferences } from '@/redux/reducers/PreferencesReducer'
import dayjs, { Dayjs } from 'dayjs'
import { useCallback, useMemo } from 'react'
import { getDayStyling } from '@/utils/day'
import { Tooltip } from '@/components/common/Tooltip'

export const Year = ({ getForPrinting = false }: { getForPrinting?: boolean }) => {
  const stateDate = useAppSelector(getDate)
  const categoryMap = useAppSelector(getCategoryMap)
  const entriesInYear = useAppSelector((state) => getYear(state, stateDate))
  const isSelectingDates = useAppSelector(getIsSelectingDates)
  const yearSelected = useAppSelector((state) => getYearSelectedDates(state, stateDate))
  const preferences = useAppSelector(getPreferences)

  const yearStartDate = dayjs(stateDate).startOf('year')
  const yearNum = yearStartDate.get('year')

  const dispatch = useAppDispatch()

  const renderDayCategories = useCallback(
    (day: Dayjs, monthNum: number, key: number) => {
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
      icons.push(<span key={`${monthNum}-${key}`}>&nbsp;</span>)
      return icons
    },
    [categoryMap, entriesInYear, isSelectingDates]
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
      const selected = yearSelected?.[monthNum]?.[day.date()]

      const dayContent = isSelectingDates ? (
        <Tooltip text={day.format('MMM D')} boundingClassName='inline-block w-full' popoverClassName='min-w-max'>
          <span
            className={`flex justify-center align-middle font-semibold ${
              selected?.isSelected ? 'text-emerald-600' : 'text-slate-300'
            }`}
          >
            {day.format('dd').charAt(0)}
          </span>
        </Tooltip>
      ) : (
        renderDayCategories(day, monthNum, dateOffset)
      )

      return (
        <div
          className={`tile px-0.5 
            ${getDayStyling(day.day(), isSelectingDates, selected)} 
            ${!isSelectingDates && isToday && !getForPrinting ? 'ring-2 ring-inset ring-emerald-300' : ''}
            ${
              preferences.yearOverflow.value === 'wrap' || getForPrinting
                ? 'inline-flow break-all'
                : 'flex overflow-x-scroll'
            }`}
          key={`${yearNum}-${monthNum}-${dateOffset}`}
          onClick={() => onDayClicked(day, !selected || !selected?.isRecurring)}
        >
          {dayContent}
        </div>
      )
    },
    [
      getForPrinting,
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
        <h3 className='sticky top-0 z-10 bg-slate-100 text-center text-slate-400' key={`col-${columnNum}-header`}>
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
    const colSpacing = getForPrinting
      ? 'grid-cols-[3.25%_7.5%_7.5%_7.5%_7.5%_3.25%_7.5%_7.5%_7.5%_7.5%_3.25%_7.5%_7.5%_7.5%_7.5%]'
      : 'grid-cols-[2.5%_7.7%_7.7%_7.7%_7.7%_2.5%_7.7%_7.7%_7.7%_7.7%_2.5%_7.7%_7.7%_7.7%_7.7%]'

    return (
      <div className={'h-full overflow-y-auto'}>
        <div
          className={`box-border grid grow divide-x divide-y border-b border-r bg-slate-300
        ${colSpacing}
        ${preferences.yearShowGrid.value || getForPrinting ? '' : 'divide-transparent'}`}
        >
          {monthHeaders}
          {days}
        </div>
      </div>
    )
  }, [getForPrinting, days, preferences.yearShowGrid.value, monthHeaders])
  return <div className='h-full bg-white'>{months}</div>
}
