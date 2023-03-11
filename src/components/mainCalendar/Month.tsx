import { useCallback } from 'react'
import { CategoryBlock } from '@/components/mainCalendar/CategoryBlock'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { getCategoryMap, getPrevCurrNextMonth } from '@/redux/reducers/AppDataReducer'
import { getDate, isMonthInterval, isYearInterval } from '@/redux/reducers/MainCalendarReducer'
import dayjs from 'dayjs'
import {
  getIsSelectingDates,
  getPrevCurrNextMonthSelectedDates,
  toggleIndividualDate
} from '@/redux/reducers/DateSelectorReducer'

interface MonthProps {
  monthOffset: number
  className?: string
}

export const Month = (props: MonthProps) => {
  const monthView = useAppSelector(isMonthInterval)
  const stateDate = useAppSelector(getDate)
  const referenceDate = useAppSelector(isYearInterval) ? dayjs(stateDate).startOf('year') : stateDate
  const isSelectingDates = useAppSelector(getIsSelectingDates)

  const targetDate = referenceDate.add(props.monthOffset, 'month')
  const monthStartDate = targetDate.startOf('month')
  const daysInMonth = targetDate.daysInMonth()
  const numWeeks = Math.ceil((daysInMonth + monthStartDate.day()) / 7)

  const categoryMap = useAppSelector(getCategoryMap)
  const { prevMonth, currMonth, nextMonth } = useAppSelector((state) => getPrevCurrNextMonth(state, targetDate))
  const { prevMonthSelected, currMonthSelected, nextMonthSelected } = useAppSelector((state) =>
    getPrevCurrNextMonthSelectedDates(state, targetDate)
  )

  const dispatch = useAppDispatch()

  const renderDay = useCallback(
    (firstDateOfWeek: number, dayNum: number) => {
      const offsetFromMonthStart = firstDateOfWeek + dayNum
      const day = monthStartDate.add(offsetFromMonthStart, 'days')
      let dayBlocks: (JSX.Element | undefined)[] = []
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

        dayBlocks = entriesOnDay?.map((entry, key) => {
          const category = categoryMap[entry.categoryId]
          if (category.show) {
            return <CategoryBlock color={category.color} label={category.name} icon={category.icon} key={key} />
          }
        })
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
          className={`tile overflow-y-auto ${
            selected?.isSelected ? (selected?.isRepeating ? 'bg-slate-100' : 'bg-emerald-100') : 'bg-white'
          } ${
            isSelectingDates && !selected?.isSelected ? 'hover:ring-2 hover:ring-inset hover:ring-emerald-200' : ''
          } px-0.5 ${isSelectingDates && !selected?.isRepeating ? 'cursor-pointer' : ''} `}
          key={day.date()}
          onClick={() => {
            if (!selected || !selected?.isRepeating) {
              dispatch(toggleIndividualDate(day))
            }
          }}
        >
          <div className={`flex items-center justify-center`}>
            <div className={`flex h-7 w-7 items-center justify-center ${todayCircle} mt-1`}>
              <span className={`${notCurrentMonth ? 'text-slate-400' : ''} block text-center text-sm`}>
                {day.date()}
              </span>
            </div>
          </div>
          {dayBlocks}
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
  }, [daysInMonth, monthStartDate, monthView, renderWeek])

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
