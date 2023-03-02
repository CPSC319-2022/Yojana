import { useCallback } from 'react'
import { CategoryBlock } from '@/components/mainCalendar/CategoryBlock'
import { useAppSelector } from '@/redux/hooks'
import { getCategoryMap, getPrevCurrNextMonth } from '@/redux/reducers/AppDataReducer'
import { getDate, isMonthInterval, isYearInterval } from '@/redux/reducers/MainCalendarReducer'
import dayjs from 'dayjs'

interface MonthProps {
  monthOffset: number
  className?: string
}

export const Month = (props: MonthProps) => {
  const monthView = useAppSelector(isMonthInterval)
  const stateDate = useAppSelector(getDate)
  const referenceDate = useAppSelector(isYearInterval) ? dayjs(stateDate).startOf('year') : stateDate

  const targetDate = referenceDate.add(props.monthOffset, 'month')
  const monthStartDate = targetDate.startOf('month')
  const daysInMonth = targetDate.daysInMonth()
  const numWeeks = Math.ceil((daysInMonth + monthStartDate.day()) / 7)

  const categoryMap = useAppSelector(getCategoryMap)
  const { prevMonth, currMonth, nextMonth } = useAppSelector((state) => getPrevCurrNextMonth(state, targetDate))

  const renderDay = useCallback(
    (firstDateOfWeek: number, dayNum: number) => {
      const offsetFromMonthStart = firstDateOfWeek + dayNum
      const day = monthStartDate.add(offsetFromMonthStart, 'days')
      let entriesOnDay
      if (offsetFromMonthStart < 0) {
        entriesOnDay = prevMonth?.[day.date()]
      } else if (offsetFromMonthStart >= daysInMonth) {
        entriesOnDay = nextMonth?.[day.date()]
      } else {
        entriesOnDay = currMonth?.[day.date()]
      }
      const dayBlocks = entriesOnDay?.map((entry, key) => {
        const category = categoryMap[entry.categoryId]
        if (category.show) {
          return <CategoryBlock color={category.color} label={category.name} icon={category.icon} key={key} />
        }
      })

      const currentDate = new Date(Date.UTC(dayjs().year(), dayjs().month(), dayjs().date()))
      const isCurrentDate = day.toISOString().slice(0, 10) === currentDate.toISOString().slice(0, 10)
      const todayCircle = isCurrentDate ? 'rounded-full bg-blue-500' : ''

      return (
        <div className={`tile overflow-y-auto bg-white pr-0.5 pl-0.5`} key={day.date()}>
          <div className={`flex items-center justify-center`}>
            <div className={`flex h-7 w-7 items-center justify-center ${todayCircle}`}>
              <span
                className={`${
                  offsetFromMonthStart < 0 || offsetFromMonthStart >= daysInMonth ? 'text-slate-400' : ''
                } block text-center`}
              >
                {day.date()}
              </span>
            </div>
          </div>
          {dayBlocks}
        </div>
      )
    },
    [categoryMap, currMonth, daysInMonth, monthStartDate, nextMonth, prevMonth]
  )

  // monthOffset is the offset of the Sunday from the beginning of the month.
  const renderWeek = useCallback(
    (firstDateOfWeek: number) => {
      const generatedDays = Array.from(Array(7).keys()).map((dayNum) => {
        return renderDay(firstDateOfWeek, dayNum)
      })
      return (
        <div
          className={(numWeeks === 5 ? 'h-1/5' : 'h-1/6') + ' ' + 'grid h-1/5 grid-cols-7 gap-0.5 pt-0.5'}
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
    for (let i = 0 - monthStartDate.day(); i < daysInMonth; i += 7) {
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
