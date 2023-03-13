import React, { Fragment, useCallback, useEffect, useRef, useState } from 'react'
import { CategoryBlock } from '@/components/mainCalendar/CategoryBlock'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { getCategoryMap, getPrevCurrNextMonth } from '@/redux/reducers/AppDataReducer'
import { getDate, isMonthInterval, isYearInterval } from '@/redux/reducers/MainCalendarReducer'
import dayjs from 'dayjs'
import { Popover, Transition } from '@headlessui/react'

import {
  getIsSelectingDates,
  getPrevCurrNextMonthSelectedDates,
  toggleIndividualDate
} from '@/redux/reducers/DateSelectorReducer'
import { Icon, IconName } from '@/components/common'

interface MonthProps {
  monthOffset: number
  className?: string
}

export const Month = (props: MonthProps) => {
  useEffect(() => {
    node = myRef.current
    if (node) {
      setClientHeight(node.clientHeight - 0.5 * 2)
      vh = window.innerHeight
    }
  }, [])
  const monthView = useAppSelector(isMonthInterval)
  const stateDate = useAppSelector(getDate)
  const referenceDate = useAppSelector(isYearInterval) ? dayjs(stateDate).startOf('year') : stateDate
  const isSelectingDates = useAppSelector(getIsSelectingDates)

  const targetDate = referenceDate.add(props.monthOffset, 'month')
  const monthStartDate = targetDate.startOf('month')
  const daysInMonth = targetDate.daysInMonth()
  const numWeeks = Math.ceil((daysInMonth + monthStartDate.day()) / 7)
  const myRef = useRef<HTMLDivElement>(null)
  let completed = false
  const [clientHeight, setClientHeight] = useState(0)
  let node: HTMLDivElement | null
  let scrollHeight = 0
  let vh: number

  let extraEvents = 0

  const categoryMap = useAppSelector(getCategoryMap)
  const { prevMonth, currMonth, nextMonth } = useAppSelector((state) => getPrevCurrNextMonth(state, targetDate))
  const { prevMonthSelected, currMonthSelected, nextMonthSelected } = useAppSelector((state) =>
    getPrevCurrNextMonthSelectedDates(state, targetDate)
  )

  const dispatch = useAppDispatch()

  const renderDay = useCallback(
    (firstDateOfWeek: number, dayNum: number) => {
      completed = false
      const offsetFromMonthStart = firstDateOfWeek + dayNum
      const day = monthStartDate.add(offsetFromMonthStart, 'days')
      let allDayBlocks: (JSX.Element | undefined)[] = []
      let dayBlocks: (JSX.Element | undefined)[] = []
      let icons: (JSX.Element | undefined)[] = []

      let selected: { isSelected: boolean; isRepeating: boolean } = { isSelected: false, isRepeating: false }
      if (!isSelectingDates) {
        let entriesOnDay
        if (offsetFromMonthStart < 0) {
          entriesOnDay = prevMonth?.[day.date()]
        } else if (offsetFromMonthStart >= daysInMonth) {
          entriesOnDay = nextMonth?.[day.date()]
        } else {
          entriesOnDay = currMonth?.[day.date()]
        }

        allDayBlocks = entriesOnDay?.map((entry, key) => {
          const category = categoryMap[entry.categoryId]
          if (category.show) {
            return (
              <CategoryBlock color={category.color} label={category.name} icon={category.icon as IconName} key={key} />
            )
          }
        })
        icons = entriesOnDay?.map((calEvent, key) => {
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
        scrollHeight = 0
        extraEvents = 0

        dayBlocks = entriesOnDay?.map((entry, key) => {
          const category = categoryMap[entry.categoryId]
          if (typeof window !== 'undefined') {
            vh = window.innerHeight * 0.01
            scrollHeight += 2 * (vh + 10)
            if (category.show) {
              if (scrollHeight + vh + 8 < clientHeight) {
                scrollHeight += vh + 8
                return (
                  <CategoryBlock
                    color={category.color}
                    label={category.name}
                    icon={category.icon as IconName}
                    key={key}
                  />
                )
              } else {
                extraEvents++
              }
            }
          }
        })
        completed = true
      } else {
        if (offsetFromMonthStart < 0) {
          selected = prevMonthSelected?.[day.date()]
        } else if (offsetFromMonthStart >= daysInMonth) {
          selected = nextMonthSelected?.[day.date()]
        } else {
          selected = currMonthSelected?.[day.date()]
        }
      }

      const isToday = dayjs().isSame(day, 'day')
      const todayCircle = isToday && !isSelectingDates ? 'rounded-full bg-emerald-200' : ''

      const notCurrentMonth = offsetFromMonthStart < 0 || offsetFromMonthStart >= daysInMonth

      return (
        <div
          ref={myRef}
          className={`tile overflow-y-hidden ${selected?.isSelected ? 'bg-emerald-100' : 'bg-white'} px-0.5 ${
            isSelectingDates && !selected?.isRepeating ? 'cursor-pointer' : ''
          } `}
          key={day.date()}
          onClick={() => {
            if (!selected || !selected?.isRepeating) {
              dispatch(toggleIndividualDate(day))
            }
          }}
        >
          <div className={`flex items-center justify-center`}>
            <div className={`flex h-3 w-7 items-center justify-center ${todayCircle} mt-1`}>
              <span className={`${notCurrentMonth ? 'text-slate-400' : ''} block text-center text-sm`}>
                {day.date()}
              </span>
            </div>
          </div>
          {completed && monthView && dayBlocks}
          {completed && !monthView && icons}
          {completed && monthView && extraEvents > 0 && (
            <Popover>
              <Popover.Button>
                <button className={'justify-center'}>{extraEvents + ' more'}</button>
              </Popover.Button>
              <Transition
                as={Fragment}
                enter='transition ease-out duration-200'
                enterFrom='opacity-0 translate-y-0'
                enterTo='opacity-100 translate-y--50'
                leave='transition ease-in duration-150'
                leaveFrom='opacity-100 translate-y-0'
                leaveTo='opacity-0 translate-y-1'
              >
                <Popover.Panel className=' -translate-y-50 z-100 absolute mt-0 h-full max-h-[400px] w-60 transform overflow-y-auto px-4 sm:px-0 lg:max-w-3xl'>
                  <div className=' rounded-lg shadow-lg ring-1 ring-black ring-opacity-5'>
                    <div className='lg:grid-rows relative grid gap-1 bg-white p-2'>
                      <span
                        className={`${
                          offsetFromMonthStart < 0 || offsetFromMonthStart >= daysInMonth ? 'text-slate-400' : ''
                        } block text-center`}
                      >
                        {day.date()}
                      </span>
                      {allDayBlocks}
                    </div>
                  </div>
                </Popover.Panel>
              </Transition>
            </Popover>
          )}
        </div>
      )
    },
    [
      monthStartDate,
      isSelectingDates,
      daysInMonth,
      prevMonth,
      nextMonth,
      currMonth,
      categoryMap,
      prevMonthSelected,
      nextMonthSelected,
      currMonthSelected,
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
