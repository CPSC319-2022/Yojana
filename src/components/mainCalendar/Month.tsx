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
  getInterval,
  isMonthInterval,
  isQuarterlyInterval,
  getDate,
  isYearInterval
} from '@/redux/reducers/MainCalendarReducer'
import { useState, useRef, useEffect, useCallback, Fragment, useMemo } from 'react'
import { DescriptionPopover } from '../DescriptionPopover'
import dayjs, { Dayjs } from 'dayjs'
import { Popover, Transition } from '@headlessui/react'
interface MonthProps {
  monthOffset: number
  className?: string
}

const CATEGORY_BANNER_HEIGHT_PX = 28
const CATEGORY_ICON_WIDTH_PX = 24

// To avoid an infinite resizing loop. The count is reset whenever the window is resized.
const MAX_TIMES_SIZE_SET = 2

export const Month = (props: MonthProps) => {
  const startingMonthNum = props.monthOffset
  const isMonthView = useAppSelector(isMonthInterval)
  const calendarInterval = useAppSelector(getInterval)
  const isQuarterlyView = useAppSelector(isQuarterlyInterval)
  const stateDate = useAppSelector(getDate)
  const referenceDate = useAppSelector(isYearInterval) ? dayjs(stateDate).startOf('year') : stateDate
  const isSelectingDates = useAppSelector(getIsSelectingDates)
  const dispatch = useAppDispatch()
  const [useBanners, setUseBanners] = useState(isMonthView)

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
  const [measureSizeCounter, setMeasureSizeCounter] = useState(0)
  const numTimesSizeSet = useRef(0)

  useEffect(() => {
    setUseBanners(isMonthView)
  }, [isMonthView])

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

  // Events that require resetting the resize count
  useEffect(() => {
    numTimesSizeSet.current = 0
  }, [calendarInterval, monthStartDate, useBanners])
  useEffect(() => {
    const windowResizeListener = () => {
      numTimesSizeSet.current = 0
      setMeasureSizeCounter(measureSizeCounter + 1)
    }
    window.addEventListener('resize', windowResizeListener)
    return () => {
      window.removeEventListener('resize', windowResizeListener)
    }
  }, [measureSizeCounter])

  // If the day's reference has changed, recompute how many elements fit in it.
  const categoryContainerRef = useCallback(
    (node: HTMLDivElement) => {
      if (node !== null && numTimesSizeSet.current < MAX_TIMES_SIZE_SET) {
        let newCount: number
        if (useBanners) newCount = Math.floor(node.getBoundingClientRect().height / CATEGORY_BANNER_HEIGHT_PX)
        else newCount = Math.floor(node.getBoundingClientRect().width / CATEGORY_ICON_WIDTH_PX)
        setNonOverflowElemCount(newCount)
        numTimesSizeSet.current += 1
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [useBanners, measureSizeCounter]
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
    (
      day: Dayjs,
      offsetFromMonthStart: number,
      getBanners: boolean,
      isForPopover = false,
      className?: string
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
                  className={className}
                />
              }
              category={category}
              dayOffset={day.day()}
              monthOffset={isMonthView ? offsetFromMonthStart : startingMonthNum}
              currentDay={day.date()}
              isNested={isForPopover}
              key={`description-${key}-${entry.categoryId}`}
            />
          )
        } else {
          return (
            <span className={'w-6 px-0.5 font-bold'} key={`${key}-${entry.id}`}>
              <style jsx>{`
                * {
                  color: ${category.color};
                }
              `}</style>
              <DescriptionPopover
                type='icon'
                component={<Icon iconName={category.icon as IconName} className='inline' />}
                category={category}
                dayOffset={day.day()}
                monthOffset={isMonthView ? offsetFromMonthStart : startingMonthNum}
                currentDay={day.date()}
                isNested={isForPopover}
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
      const allDayBanners = getBannersOrIcons(day, offsetFromMonthStart, true, true) || []
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
        <Popover className={useBanners ? 'mx-1 mt-1' : ''} key={day.format('YY-MM-DD')}>
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
      const todayCircle = isToday && !isSelectingDates ? 'rounded-full bg-emerald-200' : ''
      return (
        <div className={`flex ${isMonthView ? 'items-center justify-center' : ''}`}>
          <div className={`flex h-7 w-7 items-center justify-center ${todayCircle} ${isMonthView ? 'mt-1' : ''}`}>
            <span className={`${isCurrentMonth ? '' : 'text-slate-400'} block text-center text-sm`}>{day.date()}</span>
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
      const allCategoryElems = getBannersOrIcons(day, offsetFromMonthStart, useBanners) || []
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
            className={`flex-grow overflow-hidden ${isQuarterlyView ? 'inline-flex overflow-hidden' : ''}`}
            ref={offsetFromMonthStart === 0 ? categoryContainerRef : undefined}
          >
            {getNonOverflowCategoryElems(day, offsetFromMonthStart)}
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
      categoryContainerRef,
      getNonOverflowCategoryElems,
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
    return <div className={`${isMonthView ? 'h-[95%]' : 'h-full'}`}>{weeks}</div>
  }, [daysInMonth, monthStartDate, isMonthView, numWeeks, renderWeek])

  const generateDayNames = useMemo(() => {
    return (
      <div className='grid grid-cols-7'>
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((letter, index) => (
          <span className='tile text-m text-center text-slate-500' key={index}>
            {letter}
          </span>
        ))}
      </div>
    )
  }, [])

  return (
    <div className={`box-border bg-slate-200 ${isMonthView ? 'h-full' : ''} ${props.className}`}>
      {isMonthView && generateDayNames}
      {generateWeeks()}
    </div>
  )
}
