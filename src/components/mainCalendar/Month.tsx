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
import { Entry } from '@prisma/client'

interface MonthProps {
  monthOffset: number
  className?: string
}

export const Month = (props: MonthProps) => {
  const monthView = useAppSelector(isMonthInterval)
  const stateDate = useAppSelector(getDate)
  const referenceDate = useAppSelector(isYearInterval) ? dayjs(stateDate).startOf('year') : stateDate
  const isSelectingDates = useAppSelector(getIsSelectingDates)
  const dispatch = useAppDispatch()

  const [targetDate, setTargetDate] = useState(referenceDate.add(props.monthOffset, 'month'))
  const [monthStartDate, setMonthStartDate] = useState(targetDate.startOf('month'))
  const [daysInMonth, setDaysInMonth] = useState(targetDate.daysInMonth())
  const [numWeeks, setNumWeeks] = useState(Math.ceil((daysInMonth + monthStartDate.day()) / 7))

  const categoryMap = useAppSelector(getCategoryMap)
  const { prevMonth, currMonth, nextMonth } = useAppSelector((state) => getPrevCurrNextMonth(state, targetDate))
  const { prevMonthSelected, currMonthSelected, nextMonthSelected } = useAppSelector((state) =>
    getPrevCurrNextMonthSelectedDates(state, targetDate)
  )

  const myRef = useRef<HTMLDivElement>(null)
  // TODO "show more" logic not implemented yet
  const [nonOverflowElemCount, setNonOverflowElemCount] = useState(1)
  const [nonOverflowCountKnown, setNonOverflowCountKnown] = useState(false)

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
    const handleWindowSizeChange = () => setNonOverflowCountKnown(false)

    // TODO this currently only listens for window resizes, but not other month view resizes
    //   i.e. it can't detect when the sidebar has opened / closed.
    //   this is an issue only when horizontal spacing matters, i.e. icons view.
    window.addEventListener('resize', handleWindowSizeChange)
    return () => {
      window.removeEventListener('resize', handleWindowSizeChange)
    }
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
      return (
        <Popover className={'mx-1 mt-1'} key={day.format('YY-MM-DD')}>
          <Popover.Button className={'border-box flex w-full rounded-md px-1 hover:bg-slate-100'}>
            {allDayBlocks.length - nonOverflowElemCount + ' more'}
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
              <div className='h-fit max-h-60 w-60 overflow-y-auto rounded-lg rounded-md bg-white drop-shadow-[0_0_15px_rgba(0,0,0,0.25)]'>
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
    (entriesOnDay: Entry[], key: string, showBanners: boolean): JSX.Element[] => {
      if (isSelectingDates) return []

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
              <Icon iconName={category.icon as IconName} className='inline' />
            </span>
          )
        }
      })
      return categories.filter((element) => element !== null) as JSX.Element[]
    },
    [categoryMap, isSelectingDates]
  )

  const renderDateNum = useCallback(
    (day: Dayjs, isCurrentMonth: boolean) => {
      const isToday = dayjs().isSame(day, 'day')
      const todayCircle = isToday && !isSelectingDates ? 'rounded-full bg-emerald-200' : ''
      return (
        <div className={`flex items-center justify-center`}>
          <div className={`flex h-7 w-7 items-center justify-center ${todayCircle} mt-1`}>
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
      const key = day.format('YY-MM-DD')

      const showBanners = monthView
      const entriesOnDay = getEntriesOnDay(day.date(), offsetFromMonthStart) || []
      const allCategoryElems = getBannersOrIcons(entriesOnDay, key, showBanners) || []

      const selected = getSelectedSettings(day.date(), offsetFromMonthStart)
      const isCurrentMonth = offsetFromMonthStart >= 0 && offsetFromMonthStart < daysInMonth

      const nonOverflowCategoryElems =
        allCategoryElems.length > nonOverflowElemCount ? (
          <>
            {allCategoryElems.slice(0, nonOverflowElemCount)}
            {renderPopover(day, offsetFromMonthStart, allCategoryElems)}
          </>
        ) : (
          allCategoryElems
        )

      return (
        <div
          ref={offsetFromMonthStart === 0 ? myRef : undefined}
          key={key}
          className={`tile overflow-y-hidden  px-0.5
            ${selected?.isSelected ? 'bg-emerald-100' : 'bg-white'} 
            ${isSelectingDates && !selected?.isRepeating ? 'cursor-pointer' : ''} `}
          onClick={() => {
            if (!selected || !selected?.isRepeating) {
              dispatch(toggleIndividualDate(day))
            }
          }}
        >
          {renderDateNum(day, isCurrentMonth)}
          {nonOverflowCategoryElems}
        </div>
      )
    },
    [
      monthStartDate,
      getEntriesOnDay,
      getBannersOrIcons,
      getSelectedSettings,
      daysInMonth,
      nonOverflowElemCount,
      renderPopover,
      isSelectingDates,
      renderDateNum,
      monthView,
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
    <div className={props.className + ' ' + 'box-border bg-slate-100' + ' ' + (monthView ? 'h-full' : '')}>
      {generateDayNames()}
      {generateWeeks()}
    </div>
  )
}
