import { Icon, IconName } from '@/components/common'
import { Tooltip } from '@/components/common/Tooltip'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { getCategoryMap, getYear } from '@/redux/reducers/AppDataReducer'
import { getIsSelectingDates, getYearSelectedDates, toggleIndividualDate } from '@/redux/reducers/DateSelectorReducer'
import { getDate } from '@/redux/reducers/MainCalendarReducer'
import { getPreferences } from '@/redux/reducers/PreferencesReducer'
import { getDayStyling } from '@/utils/day'
import { useGetHoursInMonth } from '@/utils/month'
import dayjs, { Dayjs } from 'dayjs'
import { useCallback, useMemo, useState } from 'react'
import { DescriptionPopover } from '../DescriptionPopover'
import { getLocalDateWithoutTime } from '@/utils/preprocessEntries'

/**
 * Year is responsible for rendering a full year view of calendar events.
 * It leverages the dayjs library, various hooks, and state management from Redux to display calendar events in a grid format.
 * Key functionalities:
 * Different grid formats for printing and various calendar intervals.
 * Retrieving and rendering calendar events for each day.
 * Displaying tooltips and icons for events.
 * Supporting date selection for multiple purposes.
 *
 * @param {boolean} [getForPrinting] - Optional flag indicating if the Year is for printing.
 * @returns {JSX.Element}
 */
export const Year = ({ getForPrinting = false }: { getForPrinting?: boolean }) => {
  const stateDate = useAppSelector(getDate)
  const categoryMap = useAppSelector(getCategoryMap)
  const entriesInYear = useAppSelector((state) => getYear(state, stateDate))
  const isSelectingDates = useAppSelector(getIsSelectingDates)
  const yearSelected = useAppSelector((state) => getYearSelectedDates(state, stateDate))
  const preferences = useAppSelector(getPreferences)

  const yearStartDate = dayjs(stateDate).startOf('year')
  const yearNum = yearStartDate.get('year')

  const hoursInMonth = useGetHoursInMonth()

  const dispatch = useAppDispatch()
  const [popoverOpen, setPopoverOpen] = useState(-1)

  const today = getLocalDateWithoutTime(new Date())

  const renderDayCategories = useCallback(
    (day: Dayjs, monthNum: number, key: number) => {
      let icons: (JSX.Element | undefined)[] = []

      if (!isSelectingDates) {
        const entriesOnDay = entriesInYear?.[monthNum]?.[day.date()] ?? []
        icons = entriesOnDay.map((calEvent, key) => {
          const category = categoryMap[calEvent.categoryId]
          if (category.show) {
            return (
              <span className={`px-0.5 font-bold ${category.id}-icon`} key={`${calEvent.id}-${key}`}>
                <style jsx>{`
                  * {
                    color: ${category.color};
                  }
                `}</style>
                <DescriptionPopover
                  type='icon'
                  component={
                    <Icon iconName={category.icon as IconName} className='mb-0.5 inline' aria-label={category.icon} />
                  }
                  category={category}
                  dayOffset={day.day()}
                  monthOffset={monthNum}
                  currentDay={day.date()}
                  className='inline'
                  onClick={setPopoverOpen}
                />
              </span>
            )
          }
        })
      }
      icons.push(<span key={`${monthNum}-${key}`}>&#8203;</span>)
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
  let currentIndexForId = 0
  const renderDay = useCallback(
    (monthNum: number, dateOffset: number) => {
      const monthStartDate = dayjs(yearStartDate).add(monthNum, 'month')
      if (monthStartDate.daysInMonth() <= dateOffset) {
        return <span key={`${yearNum}-${monthNum}-${dateOffset}`}>&#8203;</span>
      }

      const day = monthStartDate.add(dateOffset, 'days')
      const isToday = day.isSame(today, 'day')
      const selected = yearSelected?.[monthNum]?.[day.date()]

      const dayContent = isSelectingDates ? (
        <Tooltip text={day.format('MMM D')} boundingClassName='inline-block w-full' popoverClassName='min-w-max'>
          <span
            id={`${yearNum}-${currentIndexForId}-during-selecting`}
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
          id={`${yearNum}-${currentIndexForId++}`}
          className={`tile px-0.5
            ${getDayStyling(day.day(), isSelectingDates, selected)} 
            ${!isSelectingDates && isToday && !getForPrinting ? 'ring-2 ring-inset ring-emerald-300' : ''}
            ${preferences.yearOverflow.value === 'wrap' || getForPrinting ? 'inline-flow break-all' : 'flex'}
            ${
              !(dateOffset + 1 === popoverOpen) && !(preferences.yearOverflow.value === 'wrap' || getForPrinting)
                ? 'overflow-x-scroll transition-colors invis-scrollbar hover:mac-scrollbar'
                : ''
            }
            ${dateOffset + 1 === popoverOpen ? 'flex-wrap overflow-x-visible' : ''}
            `}
          key={`${yearNum}-${monthNum}-${dateOffset}`}
          onClick={() => onDayClicked(day, !selected || !selected?.isRecurring)}
        >
          {dayContent}
        </div>
      )
    },
    [
      yearStartDate,
      yearSelected,
      isSelectingDates,
      yearNum,
      currentIndexForId,
      renderDayCategories,
      getForPrinting,
      preferences.yearOverflow.value,
      onDayClicked,
      today,
      popoverOpen
    ]
  )

  const monthHeaders = useMemo(() => {
    return Array.from(Array(15).keys()).map((columnNum) => {
      const monthNum = columnNum - Math.ceil(columnNum / 5)
      const monthStartDate = dayjs(yearStartDate).add(monthNum, 'month')
      const hours = hoursInMonth(monthStartDate)
      return (
        <span
          key={`col-${columnNum}-header`}
          className={`${!preferences.yearShowGrid.value && !getForPrinting ? 'border-none' : ''}`}
        >
          <h3
            className={`top-0 z-10 bg-slate-100 text-center text-xs text-slate-400 ${
              preferences.showWorkingHours.value ? '' : 'hidden' && getForPrinting ? '' : 'hidden'
            }`}
            key={`col-${columnNum}-header`}
          >
            {columnNum % 5 === 0 ? '\u00A0' : `${hours} hrs`}
          </h3>
          <h3 className='sticky top-0 z-10 bg-slate-100 text-center text-slate-400' key={`col-${columnNum}-header`}>
            {columnNum % 5 === 0 ? '\u00A0' : monthStartDate.format('MMM')}
          </h3>
        </span>
      )
    })
  }, [yearStartDate, hoursInMonth, preferences.yearShowGrid.value, preferences.showWorkingHours.value, getForPrinting])

  const days = useMemo(() => {
    return Array.from(Array(31).keys()).map((dateNum) => {
      return Array.from(Array(15).keys()).map((columnNum) => {
        if (columnNum % 5 === 0) {
          return (
            <div className={'bg-white px-1 pt-1 text-center text-xs'} key={`${columnNum}-${dateNum + 1}`}>
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
      : 'grid-cols-[2.25%_7.77%_7.77%_7.77%_7.77%_2.25%_7.77%_7.77%_7.77%_7.77%_2.25%_7.77%_7.77%_7.77%_7.77%]'

    return (
      <div className={'h-full overflow-y-auto'}>
        <div
          className={`box-border grid grow divide-x divide-y border-b border-r bg-slate-300
        ${colSpacing}
        ${preferences.yearShowGrid.value || getForPrinting ? '' : 'divide-transparent'}`}
          id={'year-view'}
        >
          {monthHeaders}
          {days}
        </div>
      </div>
    )
  }, [getForPrinting, days, preferences.yearShowGrid.value, monthHeaders])
  return <div className='h-full bg-white'>{months}</div>
}
