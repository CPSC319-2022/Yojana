import { CategoryBlock } from '@/components/mainCalendar/CategoryBlock'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { getCategoryMap, getPrevCurrNextMonth } from '@/redux/reducers/AppDataReducer'
import {
  getIsSelectingDates,
  getPrevCurrNextMonthSelectedDates,
  toggleIndividualDate
} from '@/redux/reducers/DateSelectorReducer'
import { Icon, IconName } from '@/components/common'
import { getDayStyling } from '@/utils/day'

import {
  getDate,
  getInterval,
  isMonthInterval,
  isQuarterlyInterval,
  isYearInterval
} from '@/redux/reducers/MainCalendarReducer'
import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { DescriptionPopover } from '../DescriptionPopover'
import dayjs, { Dayjs } from 'dayjs'
import { Popover, Transition } from '@headlessui/react'
import { getPreferences } from '@/redux/reducers/PreferencesReducer'
import { useIsomorphicLayoutEffect } from '@/utils/useIsomorphicLayoutEffect'
import weekOfYear from 'dayjs/plugin/weekOfYear'

dayjs.extend(weekOfYear)

interface MonthProps {
  monthOffset: number
  className?: string
}

const CATEGORY_BANNER_HEIGHT_PX = 28
// Width of 1 square icon (16px) including padding (4px left, 4px right). Also doubles as icon height.
const CATEGORY_ICON_PX = 24
// Width of 1 large square icon (24px) including padding (4px left, 4px right). Also doubles as large icon height.
const CATEGORY_ICON_LARGE_PX = 32

export const Month = (props: MonthProps) => {
  const startingMonthNum = props.monthOffset
  const isMonthView = useAppSelector(isMonthInterval)
  const isQuarterlyView = useAppSelector(isQuarterlyInterval)
  const stateDate = useAppSelector(getDate)
  const referenceDate = useAppSelector(isYearInterval) ? dayjs(stateDate).startOf('year') : stateDate
  const isSelectingDates = useAppSelector(getIsSelectingDates)
  const preferences = useAppSelector(getPreferences)
  const activeCalView = useAppSelector(getInterval)
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

  const [nonOverflowElemCount, setNonOverflowElemCount] = useState(0)
  const categoryContainerRef = useRef<HTMLDivElement>(null)
  const [colsPerDay, setColsPerDay] = useState(1)

  useEffect(() => {
    setUseBanners(isMonthView && preferences.monthCategoryAppearance.value === 'banners')
  }, [isMonthView, preferences.monthCategoryAppearance.value])

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
    if (categoryContainerRef.current !== null) {
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
  }, [isMonthView, useBanners])

  useIsomorphicLayoutEffect(() => {
    recalculateItemsPerDay()
    // Add any deps that would require recalculating items per day here
  }, [recalculateItemsPerDay, activeCalView, useBanners, monthStartDate])

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
      const key = day.format('YY-MM-DD')

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
                  key={`${key}-${entry.categoryId}`}
                  className={settings?.className}
                />
              }
              category={category}
              dayOffset={day.day()}
              monthOffset={isMonthView ? offsetFromMonthStart : startingMonthNum}
              currentDay={day.date()}
              isNested={settings?.isForPopover}
              key={`description-${key}-${entry.categoryId}`}
            />
          )
        } else {
          return (
            <span className={`${isMonthView ? 'h-8 w-8' : 'h-6 w-6'} px-0.5 font-bold`} key={`${key}-${entry.id}`}>
              <style jsx>{`
                * {
                  color: ${category.color};
                }
              `}</style>
              <DescriptionPopover
                type='icon'
                component={
                  <Icon
                    iconName={category.icon as IconName}
                    className='inline'
                    size={settings?.getLargeIcons && isMonthView ? 24 : 16}
                  />
                }
                category={category}
                dayOffset={day.day()}
                monthOffset={isMonthView ? offsetFromMonthStart : startingMonthNum}
                currentDay={day.date()}
                isNested={settings?.isForPopover}
                className='inline'
              />
            </span>
          )
        }
      })

      return categories.filter((element) => element !== null) as JSX.Element[]
    },
    [categoryMap, getEntriesOnDay, isSelectingDates, isMonthView, startingMonthNum]
  )

  const getPopoverContent = useCallback(
    (day: Dayjs, offsetFromMonthStart: number) => {
      const allDayBanners = getBannersOrIcons(day, offsetFromMonthStart, true, { isForPopover: true }) || []
      return (
        <div className='lg:grid-rows grid gap-1 p-2 pb-3'>
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
    (allDayBlocksLength: number) => {
      if (useBanners) {
        const hiddenElemCount = allDayBlocksLength - nonOverflowElemCount + 1
        return (
          <Popover.Button className={'border-box flex w-full rounded-md px-1 hover:bg-slate-100 focus:outline-none'}>
            {hiddenElemCount + ' more'}
          </Popover.Button>
        )
      }
      return (
        <Popover.Button
          className={
            'border-box mx-0.5 mt-1.5 h-5 w-5 items-center justify-center rounded-2xl bg-emerald-100 pl-0.5 hover:bg-emerald-200 focus:outline-none'
          }
        >
          <Icon iconName={'PlusLg'} />
        </Popover.Button>
      )
    },
    [nonOverflowElemCount, useBanners]
  )

  const appearBelow = useCallback(
    (offsetFromMonthStart: number) => {
      if (isMonthView) return offsetFromMonthStart < 21
      if (isQuarterlyView) return props.monthOffset === 0 || (props.monthOffset === 1 && offsetFromMonthStart < 21)
      else return props.monthOffset < 2
    },
    [isMonthView, isQuarterlyView, props.monthOffset]
  )

  const renderPopover = useCallback(
    (day: Dayjs, offsetFromMonthStart: number, allDayBlocksLength: number) => {
      const translateXClass = day.day() > 4 ? (useBanners ? '-translate-x-32' : '-translate-x-60') : ''
      const below = appearBelow(offsetFromMonthStart)
      const translateYClass = below ? '' : '-translate-y-64 flex h-60 flex-col justify-end'
      return (
        <Popover className={useBanners ? 'mx-1 mt-1' : 'h-6 w-6'} key={day.format('YY-MM-DD')}>
          {renderPopoverButton(allDayBlocksLength)}
          <Transition
            as={Fragment}
            enter='transition ease-out duration-200'
            enterFrom='opacity-0'
            enterTo='opacity-100'
            leave='transition ease-in duration-150'
            leaveFrom={`opacity-100 ${below ? 'translate-y-0' : ''}`}
            leaveTo={`opacity-0 ${below ? 'translate-y-1' : ''}`}
          >
            <Popover.Panel className={`${translateXClass} ${translateYClass} absolute z-50 transform`}>
              <style jsx>{`
                div {
                  box-shadow: 0 0 15px rgba(0, 0, 0, 0.25);
                  -webkit-box-shadow: 0 0 15px rgba(0, 0, 0, 0.25);
                  -moz-box-shadow: 0 0 15px rgba(0, 0, 0, 0.25);
                }
              `}</style>
              <div className='h-fit max-h-60 w-60 overflow-y-auto rounded-lg rounded-md bg-white'>
                {getPopoverContent(day, offsetFromMonthStart)}
              </div>
            </Popover.Panel>
          </Transition>
        </Popover>
      )
    },
    [appearBelow, getPopoverContent, renderPopoverButton, useBanners]
  )

  const renderDateNum = useCallback(
    (day: Dayjs, isCurrentMonth: boolean) => {
      const isToday = dayjs().isSame(day, 'day')
      const todayCircle = isToday && !isSelectingDates ? 'rounded-full bg-emerald-200 mt-1 ml-1' : ''
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
    [isMonthView, isSelectingDates]
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

      return (
        <div
          key={day.format('YY-MM-DD')}
          className={`tile flex overflow-hidden px-0.5 
            ${isMonthView ? 'flex-col' : 'flex-row'}
            ${isQuarterlyView ? 'items-center' : ''}
            ${getDayStyling(day.day(), isSelectingDates, selected)}  `}
          onClick={() => {
            if (!selected || !selected?.isRecurring) {
              dispatch(toggleIndividualDate(day))
            }
          }}
        >
          {renderDateNum(day, isCurrentMonth)}
          <div
            className={`flex-grow overflow-hidden`}
            ref={offsetFromMonthStart === 0 ? categoryContainerRef : undefined}
          >
            <style jsx>{`
              .use-grid {
                grid-template-columns: repeat(${useBanners ? 1 : colsPerDay}, minmax(0, 1fr));
              }
            `}</style>
            <div className={`${isQuarterlyView ? 'inline-flex' : 'use-grid grid'}`}>
              {getNonOverflowCategoryElems(day, offsetFromMonthStart)}
            </div>
          </div>
        </div>
      )
    },
    [
      monthStartDate,
      getSelectedSettings,
      daysInMonth,
      isMonthView,
      isQuarterlyView,
      isSelectingDates,
      renderDateNum,
      useBanners,
      colsPerDay,
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
      return (
        <div
          className={
            (numWeeks === 6 ? 'h-1/6' : 'h-1/5') +
            ' ' +
            (preferences.showWeekNumbers.value
              ? 'grid h-1/5 grid-cols-[13.43%,13.43%,13.43%,13.43%,13.43%,13.43%,13.43%,6%] gap-px pt-0.5'
              : 'grid h-1/5 grid-cols-7 gap-px pt-0.5')
          }
          key={firstDateOfWeek}
        >
          {generatedDays}
          {preferences.showWeekNumbers.value && (
            <div
              className='col-span-0.2 tile text-m flex items-center justify-center text-slate-500 '
              style={{ fontSize: '12px' }}
            >
              {weekNumber}
            </div>
          )}
        </div>
      )
    },
    [numWeeks, preferences.showWeekNumbers.value, renderDay]
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
      <div
        className={
          preferences.showWeekNumbers.value
            ? 'grid grid-cols-[13.5%,13.5%,13.5%,13.5%,13.5%,13.5%,13.5%,5.5%]'
            : 'grid grid-cols-7'
        }
      >
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((letter, index) => (
          <span className='tile text-m text-center text-slate-500' key={index}>
            {letter}
          </span>
        ))}
      </div>
    )
  }, [preferences.showWeekNumbers.value])

  return (
    <div className={`box-border bg-slate-200 ${isMonthView ? 'h-full' : ''} ${props.className}`}>
      {isMonthView && generateDayNames}
      {generateWeeks()}
    </div>
  )
}
