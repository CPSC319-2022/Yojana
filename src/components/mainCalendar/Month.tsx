import { Icon, IconName } from '@/components/common'
import { CategoryBlock } from '@/components/mainCalendar/CategoryBlock'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { getCategoryMap, getIsMobile, getPrevCurrNextMonth } from '@/redux/reducers/AppDataReducer'
import {
  getIsSelectingDates,
  getPrevCurrNextMonthSelectedDates,
  toggleIndividualDate
} from '@/redux/reducers/DateSelectorReducer'
import { getDayStyling } from '@/utils/day'

import {
  getDate,
  getInterval,
  isMonthInterval,
  isQuarterlyInterval,
  isYearInterval,
  isYearScrollInterval
} from '@/redux/reducers/MainCalendarReducer'
import { getPreferences } from '@/redux/reducers/PreferencesReducer'
import { getLocalDateWithoutTime } from '@/utils/preprocessEntries'
import { useIsomorphicLayoutEffect } from '@/utils/useIsomorphicLayoutEffect'
import { Popover, Transition } from '@headlessui/react'
import dayjs, { Dayjs } from 'dayjs'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { DescriptionPopover } from '../DescriptionPopover'

dayjs.extend(weekOfYear)

/**
 * monthOffset: The offset of the month to display from the current month.
 * className: Optional styling for Month.
 * getForPrinting: Optional flag indicating if the rendered Month is for printing.
 */
interface MonthProps {
  monthOffset: number
  className?: string
  getForPrinting?: boolean
}

/**
 * Month is responsible for rendering a month based on the provided MonthProps.
 * It leverages the dayjs library and various hooks to calculate and display the month's contents.
 * Key functionalities:
 * Calculation of days and weeks within the month using dayjs.
 * Resize handling and recalculation of icons per day.
 * Rendering of category icons or banners based on user preferences.
 * Printing support with getIconsForPrinting and getCategoryElemForPrinting functions.
 * Popover functionality for showing additional category items on overflow.
 * Date selection and styling for selecting individual dates or recurring dates.
 *
 * @param MonthProps
 * @returns {JSX.Element} The rendered Month component.
 */
const CATEGORY_BANNER_HEIGHT_PX = 28
// Width of 1 square icon (16px) including padding (4px left, 4px right). Also doubles as icon height.
const CATEGORY_ICON_PX = 24
// Width of 1 large square icon (24px) including padding (4px left, 4px right). Also doubles as large icon height.
const CATEGORY_ICON_LARGE_PX = 32

export const Month = (props: MonthProps) => {
  const startingMonthNum = props.monthOffset
  const isMonthView = useAppSelector(isMonthInterval)
  const isQuarterlyView = useAppSelector(isQuarterlyInterval)
  const isYearScrollView = useAppSelector(isYearScrollInterval)
  const stateDate = useAppSelector(getDate)
  const referenceDate = useAppSelector(isYearInterval) ? dayjs(stateDate).startOf('year') : stateDate
  const isSelectingDates = useAppSelector(getIsSelectingDates)
  const preferences = useAppSelector(getPreferences)
  const activeCalView = useAppSelector(getInterval)
  const isMobileView = useAppSelector(getIsMobile)
  const dispatch = useAppDispatch()
  const [useBanners, setUseBanners] = useState(isMonthView && preferences.monthCategoryAppearance.value === 'banners')

  const [targetDate, setTargetDate] = useState(referenceDate.add(props.monthOffset, 'month'))
  const [monthStartDate, setMonthStartDate] = useState(targetDate.startOf('month'))
  const [daysInMonth, setDaysInMonth] = useState(targetDate.daysInMonth())
  const [numWeeks, setNumWeeks] = useState(Math.ceil((daysInMonth + monthStartDate.day()) / 7))

  const categoryMap = useAppSelector(getCategoryMap)
  const { prevMonth, currMonth, nextMonth } = useAppSelector((state) => getPrevCurrNextMonth(state, targetDate))
  const { prevMonthSelected, currMonthSelected, nextMonthSelected } = useAppSelector((state) =>
    getPrevCurrNextMonthSelectedDates(state, targetDate)
  )

  const [nonOverflowElemCount, setNonOverflowElemCount] = useState(1)
  const categoryContainerRef = useRef<HTMLDivElement>(null)
  const [colsPerDay, setColsPerDay] = useState(1)
  const [overflowVisible, setOverflowVisible] = useState<string | null>(null)
  const [popoverOpen, setPopoverOpen] = useState(-1)

  const today = getLocalDateWithoutTime(new Date())

  useEffect(() => {
    setUseBanners(!isMobileView && isMonthView && preferences.monthCategoryAppearance.value === 'banners')
  }, [isMobileView, isMonthView, preferences.monthCategoryAppearance.value])

  // Determines what days and weeks are in the month.
  useEffect(() => {
    const newTarget = referenceDate.add(props.monthOffset, 'month')
    const newStart = newTarget.startOf('month')
    const newDaysInMonth = newTarget.daysInMonth()

    setTargetDate(newTarget)
    setMonthStartDate(newStart)
    setDaysInMonth(newDaysInMonth)
    setNumWeeks(Math.ceil((newDaysInMonth + newStart.day()) / 7))
  }, [props.monthOffset, referenceDate])

  const recalculateItemsPerDay = useCallback(() => {
    if (typeof window !== 'undefined' && overflowVisible === null && categoryContainerRef.current !== null) {
      const { offsetHeight, offsetWidth } = categoryContainerRef.current
      if (useBanners) setNonOverflowElemCount(Math.floor(offsetHeight / CATEGORY_BANNER_HEIGHT_PX))
      else {
        const iconSize = isMonthView ? CATEGORY_ICON_LARGE_PX : CATEGORY_ICON_PX
        const iconsPerRow = Math.floor(offsetWidth / iconSize)
        const rowsPerDay = Math.floor(offsetHeight / iconSize) || 1
        setColsPerDay(iconsPerRow)
        setNonOverflowElemCount(iconsPerRow * rowsPerDay)
      }
    }
  }, [isMonthView, overflowVisible, useBanners])

  useIsomorphicLayoutEffect(() => {
    recalculateItemsPerDay()
    // Add any deps that would require recalculating items per day here
  }, [recalculateItemsPerDay, activeCalView, useBanners, monthStartDate.month(), monthStartDate.year()])

  useEffect(() => {
    if (!categoryContainerRef.current) return

    const resizeObserver = new ResizeObserver(recalculateItemsPerDay)
    resizeObserver.observe(categoryContainerRef.current)

    return () => resizeObserver.disconnect()
  }, [recalculateItemsPerDay])

  useEffect(() => {
    window.addEventListener('resize', () => recalculateItemsPerDay())
    return () => {
      window.removeEventListener('resize', () => recalculateItemsPerDay())
    }
  }, [recalculateItemsPerDay])

  const getEntriesOnDay = useCallback(
    (dateNum: number, offsetFromMonthStart: number) => {
      if (offsetFromMonthStart < 0) {
        return prevMonth?.[dateNum]
      } else if (offsetFromMonthStart >= daysInMonth) {
        return nextMonth?.[dateNum]
      } else {
        return currMonth?.[dateNum]
      }
    },
    [currMonth, daysInMonth, nextMonth, prevMonth]
  )

  const getBannersOrIcons = useCallback(
    (
      day: Dayjs,
      offsetFromMonthStart: number,
      getBanners: boolean,
      settings?: { getLargeIcons?: boolean; isForPopover?: boolean; className?: string }
    ): JSX.Element[] => {
      if (isSelectingDates) return []

      const entriesOnDay = getEntriesOnDay(day.date(), offsetFromMonthStart) || []
      const dayFormatted = day.format('YY-MM-DD')

      const categories = entriesOnDay?.map((entry) => {
        const category = categoryMap[entry.categoryId]
        if (!category.show) return null
        if (getBanners) {
          return (
            <DescriptionPopover
              type='block'
              component={
                <CategoryBlock
                  color={category.color}
                  label={category.name}
                  icon={category.icon as IconName}
                  key={`block-${dayFormatted}-${entry.categoryId}`}
                  className={settings?.className}
                />
              }
              category={category}
              dayOffset={day.day()}
              monthOffset={isMonthView ? offsetFromMonthStart : startingMonthNum}
              currentDay={day.date()}
              isNested={settings?.isForPopover}
              key={`desc-block-${dayFormatted}-${entry.categoryId}`}
              onClick={setPopoverOpen}
            />
          )
        } else {
          return (
            <span
              className={`${isMonthView ? 'h-8 w-8' : 'h-6 w-6'} px-0.5 text-center font-bold`}
              key={`icon-${dayFormatted}-${entry.id}`}
            >
              <DescriptionPopover
                key={`desc-icon-${dayFormatted}-${entry.categoryId}`}
                type='icon'
                component={
                  <Icon
                    key={`icon-${dayFormatted}-${entry.categoryId}`}
                    iconName={category.icon as IconName}
                    className='inline'
                    size={settings?.getLargeIcons && isMonthView ? 24 : 16}
                    color={category.color}
                  />
                }
                category={category}
                dayOffset={day.day()}
                monthOffset={isMonthView ? offsetFromMonthStart : startingMonthNum}
                currentDay={day.date()}
                isNested={settings?.isForPopover}
                className='inline'
                onClick={setPopoverOpen}
              />
            </span>
          )
        }
      })

      return categories.filter((element) => element !== null) as JSX.Element[]
    },
    [categoryMap, getEntriesOnDay, isSelectingDates, isMonthView, startingMonthNum]
  )

  const getIconsForPrinting = useCallback(
    (day: Dayjs, offsetFromMonthStart: number): JSX.Element[] => {
      const entriesOnDay = getEntriesOnDay(day.date(), offsetFromMonthStart) || []

      const categories = entriesOnDay?.map((entry) => {
        const category = categoryMap[entry.categoryId]
        if (!category.show) return null

        const dayFormatted = day.format('YYYY-MM-DD')
        return (
          <span className={`h-6 w-6 px-0.5 font-bold`} key={`print-${dayFormatted}-${entry.id}`}>
            <Icon iconName={category.icon as IconName} className='inline' size={12} color={category.color} />
          </span>
        )
      })
      return categories.filter((element) => element !== null) as JSX.Element[]
    },
    [categoryMap, getEntriesOnDay]
  )

  const getPopoverContent = useCallback(
    (day: Dayjs, offsetFromMonthStart: number) => {
      const allDayBanners = getBannersOrIcons(day, offsetFromMonthStart, true, { isForPopover: true }) || []
      return (
        <div className='lg:grid-rows grid gap-1 overflow-x-hidden p-2 pb-3'>
          <span
            className={`${
              offsetFromMonthStart < 0 || offsetFromMonthStart >= daysInMonth ? 'text-slate-400' : ''
            } block text-center`}
          >
            {day.date()}
          </span>
          {allDayBanners}
        </div>
      )
    },
    [daysInMonth, getBannersOrIcons]
  )

  const renderPopoverButton = useCallback(
    (allDayBlocksLength: number, day: Dayjs) => {
      if (useBanners) {
        const hiddenElemCount = allDayBlocksLength - nonOverflowElemCount + 1
        return (
          <Popover.Button
            onClick={() => setOverflowVisible(day.format('YYYY-MM-DD'))}
            className={'border-box flex w-full rounded-md px-1 hover:bg-slate-100 focus:outline-none'}
          >
            {hiddenElemCount + ' more'}
          </Popover.Button>
        )
      }
      return (
        <Popover.Button
          className={
            'border-box mx-0.5 mt-1 mb-0.5 h-5 w-5 items-center justify-center rounded-2xl bg-emerald-100 pl-0.5 hover:bg-emerald-200 focus:outline-none'
          }
          onClick={() => setOverflowVisible(day.format('YYYY-MM-DD'))}
        >
          <Icon iconName={'PlusLg'} />
        </Popover.Button>
      )
    },
    [nonOverflowElemCount, useBanners, setOverflowVisible]
  )

  const appearBelow = useCallback(
    (offsetFromMonthStart: number, month: number) => {
      if (isMonthView) return offsetFromMonthStart < 15
      if (isQuarterlyView) return props.monthOffset === 0 || (props.monthOffset === 1 && offsetFromMonthStart < 15)
      if (isYearScrollView) return month % 2 == 0 || props.monthOffset < 5
      else return props.monthOffset < 2
    },
    [isMonthView, isQuarterlyView, isYearScrollView, props.monthOffset]
  )

  const renderPopover = useCallback(
    (day: Dayjs, offsetFromMonthStart: number, allDayBlocksLength: number) => {
      const translateXClass = !(isMonthView || isQuarterlyView || isYearScrollView)
        ? day.day() <= 3
          ? ''
          : '-translate-x-60'
        : (day.day() > 4 || (day.month() % 2 !== 0 && !isMonthView)) && !isYearScrollView
        ? useBanners
          ? '-translate-x-32'
          : '-translate-x-60'
        : day.day() > 3 && isYearScrollView
        ? '-translate-x-60'
        : ''
      const below = appearBelow(offsetFromMonthStart, day.month())
      let translateYClass = below ? '' : '-translate-y-64 flex h-60 flex-col justify-end'
      if (isYearScrollView)
        translateYClass =
          day.month() <= 3 && offsetFromMonthStart < 31 ? '' : '-translate-y-64 flex h-60 flex-col justify-end'
      const dayFormatted = day.format('YYYY-MM-DD')
      return (
        <>
          {isMobileView && overflowVisible === dayFormatted && (
            <div
              className={`fixed inset-0 top-[10vh] z-10 flex h-[90vh] w-screen bg-slate-800 opacity-30 transition-colors 
                duration-300 ease-in-out`}
              aria-hidden='true'
            />
          )}
          <Popover className={`${useBanners ? 'mx-1 mt-1' : 'h-6 w-6'} relative`} key={day.format('YY-MM-DD')}>
            {renderPopoverButton(allDayBlocksLength, day)}
            <Transition
              as={Fragment}
              enter='transition ease-out duration-100'
              enterFrom='transform opacity-0 scale-95'
              enterTo='transform opacity-100 scale-100'
              leave='transition ease-in duration-75'
              leaveFrom='transform opacity-100 scale-100'
              leaveTo='transform opacity-0 scale-95'
              beforeLeave={() => setOverflowVisible(null)}
            >
              <Popover.Panel
                className={
                  isMobileView
                    ? 'fixed bottom-0 left-0 z-40 w-screen'
                    : `absolute z-50 transform ${translateXClass} ${translateYClass}`
                }
              >
                <div
                  className={`${
                    isMobileView ? 'h-[40vh] w-full' : 'h-fit max-h-60 w-60'
                  } box-shadow overflow-y-auto rounded-lg rounded-md bg-white`}
                >
                  {getPopoverContent(day, offsetFromMonthStart)}
                </div>
              </Popover.Panel>
            </Transition>
          </Popover>
        </>
      )
    },
    [
      appearBelow,
      getPopoverContent,
      isMobileView,
      isMonthView,
      isQuarterlyView,
      isYearScrollView,
      overflowVisible,
      renderPopoverButton,
      useBanners
    ]
  )

  const renderDateNum = useCallback(
    (day: Dayjs, isCurrentMonth: boolean) => {
      const isToday = day.isSame(today, 'day')
      const todayCircle = isToday && !isSelectingDates ? `rounded-full bg-emerald-200 font-semibold` : ''
      return (
        <div className={`flex ${isMonthView ? 'items-center justify-center' : ''}`}>
          <div className={`flex h-7 w-7 items-center justify-center ${todayCircle} ${isMonthView ? 'mt-1' : ''}`}>
            <span
              className={`block text-center ${isMonthView ? 'text-sm' : 'text-xs'} ${
                isCurrentMonth ? '' : 'text-slate-400'
              }`}
            >
              {day.date()}
            </span>
          </div>
        </div>
      )
    },
    [isMonthView, isSelectingDates, today]
  )

  const getSelectedSettings = useCallback(
    (dateNum: number, offsetFromMonthStart: number) => {
      if (!isSelectingDates) return { isSelected: false, isRecurring: false }
      if (offsetFromMonthStart < 0) {
        return prevMonthSelected?.[dateNum]
      } else if (offsetFromMonthStart >= daysInMonth) {
        return nextMonthSelected?.[dateNum]
      } else {
        return currMonthSelected?.[dateNum]
      }
    },
    [currMonthSelected, daysInMonth, isSelectingDates, nextMonthSelected, prevMonthSelected]
  )

  const getNonOverflowCategoryElems = useCallback(
    (day: Dayjs, offsetFromMonthStart: number) => {
      const allCategoryElems = getBannersOrIcons(day, offsetFromMonthStart, useBanners, { getLargeIcons: true }) || []
      if (allCategoryElems.length <= nonOverflowElemCount) return allCategoryElems

      const nonOverflowElems = allCategoryElems.slice(0, nonOverflowElemCount - 1)
      nonOverflowElems.push(renderPopover(day, offsetFromMonthStart, allCategoryElems.length))
      return nonOverflowElems
    },
    [getBannersOrIcons, useBanners, nonOverflowElemCount, renderPopover]
  )

  const renderDay = useCallback(
    (firstDateOfWeek: number, dayNum: number) => {
      const offsetFromMonthStart = firstDateOfWeek + dayNum
      const day = monthStartDate.add(offsetFromMonthStart, 'days')

      const selected = getSelectedSettings(day.date(), offsetFromMonthStart)
      const isCurrentMonth = offsetFromMonthStart >= 0 && offsetFromMonthStart < daysInMonth
      const dayFormatted = day.format('YYYY-MM-DD')

      return (
        <div
          key={dayFormatted}
          className={`tile flex px-0.5
          ${overflowVisible === day.format('YYYY-MM-DD') || popoverOpen === day.date() ? '' : 'overflow-hidden'}
          ${preferences.showWeekNumbers.value ? 'col-span-3' : ''}
            ${props.getForPrinting ? 'flex-row' : isMonthView ? 'flex-col' : 'flex-row'}
            ${props.getForPrinting ? '' : isQuarterlyView ? 'items-center' : ''}
            ${getDayStyling(day.day(), isSelectingDates, selected)}
            `}
          onClick={() => {
            if (!selected || !selected?.isRecurring) {
              dispatch(toggleIndividualDate(day))
            }
          }}
        >
          {renderDateNum(day, isCurrentMonth)}
          <div
            className={`flex-grow
            ${overflowVisible === dayFormatted || popoverOpen === day.date() ? '' : 'overflow-hidden'}`}
            ref={offsetFromMonthStart === 0 ? categoryContainerRef : undefined}
            key={`grid-${dayFormatted}`}
          >
            <style jsx>{`
              .use-grid {
                grid-template-columns: repeat(${useBanners ? 1 : colsPerDay}, minmax(0, 1fr));
              }
            `}</style>
            <div
              className={`${
                props.getForPrinting
                  ? 'flex inline-flex flex-wrap overflow-y-hidden'
                  : isQuarterlyView
                  ? 'inline-flex'
                  : `use-grid grid ${isMobileView ? 'justify-items-center' : ''}`
              }`}
            >
              {props.getForPrinting
                ? getIconsForPrinting(day, offsetFromMonthStart)
                : getNonOverflowCategoryElems(day, offsetFromMonthStart)}
            </div>
          </div>
        </div>
      )
    },
    [
      monthStartDate,
      getSelectedSettings,
      daysInMonth,
      overflowVisible,
      popoverOpen,
      preferences.showWeekNumbers.value,
      props.getForPrinting,
      isMonthView,
      isQuarterlyView,
      isSelectingDates,
      renderDateNum,
      useBanners,
      colsPerDay,
      isMobileView,
      getIconsForPrinting,
      getNonOverflowCategoryElems,
      dispatch
    ]
  )

  // monthOffset is the offset of the Sunday from the beginning of the month.
  const renderWeek = useCallback(
    (firstDateOfWeek: number, weekNumber: number) => {
      const generatedDays = Array.from(Array(7).keys()).map((dayNum) => {
        return renderDay(firstDateOfWeek, dayNum)
      })
      // const generatedDays = <div key={`week-${weekNumber}`}>hi</div>
      return (
        <div
          className={
            (numWeeks === 6 ? 'h-1/6' : 'h-1/5') +
            ' ' +
            (preferences.showWeekNumbers.value ? 'grid grid-cols-22 gap-px pt-0.5' : 'grid grid-cols-7 gap-px pt-0.5') +
            ' ' +
            (props.getForPrinting ? 'overflow-y-hidden' : '')
          }
          key={weekNumber}
        >
          {generatedDays}
          {preferences.showWeekNumbers.value && (
            <div className='tile text-m flex items-center justify-center text-xs text-slate-500'>{weekNumber}</div>
          )}
        </div>
      )
    },
    [numWeeks, preferences.showWeekNumbers.value, props.getForPrinting, renderDay]
  )

  const generateWeeks = useCallback(() => {
    const weeks = []
    const target = numWeeks <= 4 ? 30 : daysInMonth
    for (let i = 0 - monthStartDate.day(); i < target; i += 7) {
      const date = dayjs(monthStartDate).add(i, 'day')
      const weekOfYear = date.week()
      weeks.push(renderWeek(i, weekOfYear))
    }
    return <div className={`${isMonthView ? 'h-[95%]' : 'h-full'}`}>{weeks}</div>
  }, [daysInMonth, monthStartDate, isMonthView, numWeeks, renderWeek])

  const generateDayNames = useMemo(() => {
    return (
      <div className={preferences.showWeekNumbers.value ? 'grid grid-cols-22' : 'grid grid-cols-7'}>
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((letter, index) => (
          <span
            className={`tile text-m text-center text-slate-500 ${
              preferences.showWeekNumbers.value ? 'col-span-3' : ''
            }`}
            key={index}
          >
            {letter}
          </span>
        ))}
      </div>
    )
  }, [preferences.showWeekNumbers.value])

  return (
    <div
      className={`box-border bg-slate-200 ${props.getForPrinting ? '' : isMonthView ? 'h-full' : ''} ${
        props.className
      }`}
    >
      {(isMonthView && generateDayNames) || props.getForPrinting}
      {generateWeeks()}
    </div>
  )
}
