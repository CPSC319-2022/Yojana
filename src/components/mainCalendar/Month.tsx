import React, { Fragment, useCallback, useEffect, useRef, useState } from 'react'
import { CategoryBlock } from '@/components/mainCalendar/CategoryBlock'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { getCategoryMap, getPrevCurrNextMonth } from '@/redux/reducers/AppDataReducer'
import { getDate, isMonthInterval, isYearInterval } from '@/redux/reducers/MainCalendarReducer'
import dayjs, { Dayjs } from 'dayjs'
import { Popover, Transition } from '@headlessui/react'

import {
  getIsSelectingDates,
  getPrevCurrNextMonthSelectedDates,
  toggleIndividualDate
} from '@/redux/reducers/DateSelectorReducer'
import { Icon, IconName } from '@/components/common'
import { getPreferences } from '@/redux/reducers/PreferencesReducer'

interface MonthProps {
  monthOffset: number
  className?: string
}

const CATEGORY_BLOCK_HEIGHT_PX = 28

export const Month = (props: MonthProps) => {
  const monthView = useAppSelector(isMonthInterval)
  const stateDate = useAppSelector(getDate)
  const referenceDate = useAppSelector(isYearInterval) ? dayjs(stateDate).startOf('year') : stateDate
  const isSelectingDates = useAppSelector(getIsSelectingDates)
  const dispatch = useAppDispatch()
  const preferences = useAppSelector(getPreferences)

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
  const [nonOverflowCountKnown, setNonOverflowCountKnown] = useState(false)
  const monthRef = useRef<HTMLDivElement>(null)
  const categoryContainerRef = useCallback(
    (node: HTMLDivElement) => {
      if (node !== null && !nonOverflowCountKnown) {
        setNonOverflowElemCount(Math.floor(node.getBoundingClientRect().height / CATEGORY_BLOCK_HEIGHT_PX))
        setNonOverflowCountKnown(true)
      }
    },
    [nonOverflowCountKnown]
  )

  useEffect(() => {
    const newTarget = referenceDate.add(props.monthOffset, 'month')
    const newStart = newTarget.startOf('month')
    const newDaysInMonth = newTarget.daysInMonth()

    setTargetDate(newTarget)
    setMonthStartDate(newStart)
    setDaysInMonth(newDaysInMonth)
    setNumWeeks(Math.ceil((newDaysInMonth + newStart.day()) / 7))
  }, [props.monthOffset, referenceDate])

  useEffect(() => {
    if (!monthRef.current) return

    const handleWindowSizeChange = () => setNonOverflowCountKnown(false)
    const resizeObserver = new ResizeObserver(handleWindowSizeChange)
    resizeObserver.observe(monthRef.current)
    return () => resizeObserver.disconnect()
  }, [])

  useEffect(() => {
    setNonOverflowCountKnown(false)
  }, [numWeeks])

  const getPopoverContent = useCallback(
    (day: Dayjs, offsetFromMonthStart: number, allDayBlocks: JSX.Element[]) => {
      return (
        <div className='lg:grid-rows relative grid gap-1 p-2 pb-3'>
          <span
            className={`${
              offsetFromMonthStart < 0 || offsetFromMonthStart >= daysInMonth ? 'text-slate-400' : ''
            } block text-center`}
          >
            {day.date()}
          </span>
          {allDayBlocks}
        </div>
      )
    },
    [daysInMonth]
  )

  const renderPopover = useCallback(
    (day: Dayjs, offsetFromMonthStart: number, allDayBlocks: JSX.Element[]) => {
      const translateXClass = day.day() === 6 ? '-translate-x-32' : ''
      const appearBelow = offsetFromMonthStart < 21
      const translateYClass = appearBelow ? '' : '-translate-y-64 flex h-60 flex-col justify-end'
      const hiddenElemCount = allDayBlocks.length - nonOverflowElemCount + 1
      return (
        <Popover className={'mx-1 mt-1'} key={day.format('YY-MM-DD')}>
          <Popover.Button className={'border-box flex w-full rounded-md px-1 hover:bg-slate-100 focus:outline-none'}>
            {hiddenElemCount + ' more'}
          </Popover.Button>
          <Transition
            as={Fragment}
            enter='transition ease-out duration-200'
            enterFrom='opacity-0'
            enterTo='opacity-100'
            leave='transition ease-in duration-150'
            leaveFrom={`opacity-100 ${appearBelow ? 'translate-y-0' : ''}`}
            leaveTo={`opacity-0 ${appearBelow ? 'translate-y-1' : ''}`}
          >
            <Popover.Panel className={`${translateXClass} ${translateYClass} z-100 absolute transform`}>
              <style jsx>{`
                div {
                  box-shadow: 0 0 15px rgba(0, 0, 0, 0.25);
                  -webkit-box-shadow: 0 0 15px rgba(0, 0, 0, 0.25);
                  -moz-box-shadow: 0 0 15px rgba(0, 0, 0, 0.25);
                }
              `}</style>
              <div className='h-fit max-h-60 w-60 overflow-y-auto rounded-lg rounded-md bg-white'>
                {getPopoverContent(day, offsetFromMonthStart, allDayBlocks)}
              </div>
            </Popover.Panel>
          </Transition>
        </Popover>
      )
    },
    [getPopoverContent, nonOverflowElemCount]
  )

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
    (day: Dayjs, offsetFromMonthStart: number, showBanners: boolean): JSX.Element[] => {
      if (isSelectingDates) return []

      const entriesOnDay = getEntriesOnDay(day.date(), offsetFromMonthStart) || []
      const key = day.format('YY-MM-DD')

      const categories = entriesOnDay?.map((entry) => {
        const category = categoryMap[entry.categoryId]
        if (!category.show) return null
        if (showBanners) {
          return (
            <CategoryBlock
              color={category.color}
              label={category.name}
              icon={category.icon as IconName}
              key={`${key}-${entry.categoryId}`}
            />
          )
        } else {
          return (
            <span className={'px-0.5 font-bold'} key={`${key}-${entry.id}`}>
              <style jsx>{`
                * {
                  color: ${category.color};
                }
              `}</style>
              <Icon iconName={category.icon as IconName} className='inline' size={23} />
            </span>
          )
        }
      })

      return categories.filter((element) => element !== null) as JSX.Element[]
    },
    [categoryMap, getEntriesOnDay, isSelectingDates]
  )

  const renderDateNum = useCallback(
    (day: Dayjs, isCurrentMonth: boolean) => {
      const isToday = dayjs().isSame(day, 'day')
      const todayCircle = isToday && !isSelectingDates ? 'rounded-full bg-emerald-200' : ''
      return (
        <div className={`flex items-center justify-center`}>
          <div className={`flex h-7 w-7 items-center justify-center pb-1 pt-1 ${todayCircle} mt-1`}>
            <span className={`${isCurrentMonth ? '' : 'text-slate-400'} block text-center text-sm`}>{day.date()}</span>
          </div>
        </div>
      )
    },
    [isSelectingDates]
  )

  const getSelectedSettings = useCallback(
    (dateNum: number, offsetFromMonthStart: number) => {
      if (!isSelectingDates) return { isSelected: false, isRepeating: false }
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

  const renderDay = useCallback(
    (firstDateOfWeek: number, dayNum: number) => {
      const offsetFromMonthStart = firstDateOfWeek + dayNum
      const day = monthStartDate.add(offsetFromMonthStart, 'days')

      // make an explicit showBanners variable because we'll be adding logic to this later.
      const showBanners = monthView && preferences.monthCategoryAppearance.value === 'banners' // don't inline this variable.
      const allCategoryElems = getBannersOrIcons(day, offsetFromMonthStart, showBanners) || []

      const selected = getSelectedSettings(day.date(), offsetFromMonthStart)
      const isCurrentMonth = offsetFromMonthStart >= 0 && offsetFromMonthStart < daysInMonth

      const nonOverflowCategoryElems =
        showBanners && allCategoryElems.length > nonOverflowElemCount ? (
          <>
            {allCategoryElems.slice(0, nonOverflowElemCount - 1)}
            {renderPopover(day, offsetFromMonthStart, allCategoryElems)}
          </>
        ) : (
          allCategoryElems
        )

      return (
        <div
          key={day.format('YY-MM-DD')}
          className={`tile flex flex-col overflow-y-hidden px-0.5
            ${selected?.isSelected ? 'bg-emerald-100' : 'bg-white'} 
            ${isSelectingDates && !selected?.isRepeating ? 'cursor-pointer' : ''} `}
          onClick={() => {
            if (!selected || !selected?.isRepeating) {
              dispatch(toggleIndividualDate(day))
            }
          }}
        >
          {renderDateNum(day, isCurrentMonth)}
          <div className='flex-grow' ref={offsetFromMonthStart === 0 ? categoryContainerRef : undefined}>
            {nonOverflowCategoryElems}
          </div>
        </div>
      )
    },
    [
      monthStartDate,
      monthView,
      getBannersOrIcons,
      getSelectedSettings,
      daysInMonth,
      nonOverflowElemCount,
      renderPopover,
      isSelectingDates,
      renderDateNum,
      categoryContainerRef,
      preferences.monthCategoryAppearance.value,
      dispatch
    ]
  )

  // monthOffset is the offset of the Sunday from the beginning of the month.
  const renderWeek = useCallback(
    (firstDateOfWeek: number) => {
      const generatedDays = Array.from(Array(7).keys()).map((dayNum) => {
        return renderDay(firstDateOfWeek, dayNum)
      })
      return (
        <div
          className={(numWeeks === 6 ? 'h-1/6' : 'h-1/5') + ' ' + 'grid h-1/5 grid-cols-7 gap-px pt-0.5'}
          key={firstDateOfWeek}
        >
          {generatedDays}
        </div>
      )
    },
    [numWeeks, renderDay]
  )

  const generateWeeks = useCallback(() => {
    const weeks = []
    const target = numWeeks <= 4 ? 30 : daysInMonth
    for (let i = 0 - monthStartDate.day(); i < target; i += 7) {
      weeks.push(renderWeek(i))
    }
    return <div className={`${monthView ? 'h-[95%]' : 'h-[90%]'}`}>{weeks}</div>
  }, [daysInMonth, monthStartDate, monthView, numWeeks, renderWeek])

  const generateDayNames = useCallback(() => {
    return (
      <div className='grid grid-cols-7'>
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((letter, index) => (
          <span className='tile text-m text-center text-slate-400' key={index}>
            {letter}
          </span>
        ))}
      </div>
    )
  }, [])

  return (
    <div
      ref={monthRef}
      className={props.className + ' ' + 'box-border bg-slate-100' + ' ' + (monthView ? 'h-full' : '')}
    >
      {generateDayNames()}
      {generateWeeks()}
    </div>
  )
}
