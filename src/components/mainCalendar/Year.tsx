import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { getCategoryMap, getYear } from '@/redux/reducers/AppDataReducer'
import { getIsSelectingDates, getYearSelectedDates, toggleIndividualDate } from '@/redux/reducers/DateSelectorReducer'
import { getDate, getGridPreference, getYearPreference } from '@/redux/reducers/MainCalendarReducer'
import dayjs, { Dayjs } from 'dayjs'
import { useCallback, useMemo } from 'react'

export const Year = () => {
  const stateDate = useAppSelector(getDate)
  const categoryMap = useAppSelector(getCategoryMap)
  const entriesInYear = useAppSelector((state) => getYear(state, stateDate))
  const isSelectingDates = useAppSelector(getIsSelectingDates)
  const yearSelected = useAppSelector((state) => getYearSelectedDates(state, stateDate))
  const gridViewPref = useAppSelector(getGridPreference)
  const yearViewPref = useAppSelector(getYearPreference)

  const yearStartDate = dayjs(stateDate).startOf('year')
  const yearNum = yearStartDate.get('year')

  const dispatch = useAppDispatch()

  const renderDayCategories = useCallback(
    (day: Dayjs, monthNum: number) => {
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
                {category.icon}
              </span>
            )
          }
        })
      }
      icons.push(<span key={`${monthNum}-${day.get('day')}`}>&nbsp;</span>)
      return icons
    },
    [categoryMap, entriesInYear, isSelectingDates]
  )

  const renderDay = useCallback(
    (monthStartDate: Dayjs, dateOffset: number, monthNum: number) => {
      const day = monthStartDate.add(dateOffset, 'days')
      const isWeekend = day.day() === 0 || day.day() === 6
      const selected = yearSelected?.[monthNum]?.[day.date()]
      const isToday = day.isSame(dayjs(), 'day')

      let backgroundColor
      if (!isSelectingDates) {
        backgroundColor = isWeekend ? 'bg-slate-100' : 'bg-white'
      } else {
        if (isWeekend && selected?.isSelected) {
          backgroundColor = 'bg-emerald-200'
        } else if (isWeekend) {
          backgroundColor = 'bg-slate-100'
        } else if (selected?.isSelected) {
          backgroundColor = 'bg-emerald-100'
        } else {
          backgroundColor = 'bg-white'
        }
      }

      return (
        <div
          className={`tile px-0.5 ${backgroundColor} ${
            isSelectingDates && !selected?.isRepeating ? 'cursor-pointer' : ''
          } ${!isSelectingDates && isToday ? 'shadow-[inset_0_0_1px_2px] shadow-emerald-300' : ''}
            ${yearViewPref ? 'grid' : 'flex overflow-x-scroll'}`}
          key={`${yearNum}-${monthNum}-${day.date()}`}
          onClick={() => {
            if (!selected || !selected?.isRepeating) {
              dispatch(toggleIndividualDate(day))
            }
          }}
        >
          12345678912345
          {renderDayCategories(day, monthNum)}
        </div>
      )
    },
    [dispatch, isSelectingDates, renderDayCategories, yearNum, yearSelected]
  )

  const generateMonth = useCallback(
    (monthStartDate: Dayjs) => {
      const daysInMonth = monthStartDate.daysInMonth()
      const monthNum = monthStartDate.get('month')

      const days = []

      for (let offset = 0; offset < daysInMonth; offset++) {
        days.push(renderDay(monthStartDate, offset, monthNum))
      }

      return (
        <div
          className={`box-border divide-y 
        ${gridViewPref ? 'divide-slate-200' : 'divide-white'} `}
        >
          {days}
        </div>
      )
    },
    [renderDay]
  )

  const renderDateNums = useMemo(() => {
    const dateNums = Array.from(Array(31).keys()).map((dateNum) => {
      return (
        <div className={'px-1'} key={dateNum + 1}>
          {dateNum + 1}
        </div>
      )
    })
    return <div className='divide-y divide-slate-200'>{dateNums}</div>
  }, [])

  const months = useMemo(() => {
    const twelveMonths = Array.from(Array(12).keys()).map((monthNum) => {
      const monthStartDate = dayjs(yearStartDate).add(monthNum, 'month')
      return (
        <div className='bg-white' key={`${yearNum}-${monthNum}`}>
          <h3 className='sticky top-0 bg-slate-100 text-center text-slate-400'>{monthStartDate.format('MMM')}</h3>
          {generateMonth(monthStartDate)}
        </div>
      )
    })
    return Array.from(Array(3).keys()).map((groupNum) => {
      return (
        <div className={'inline-flex w-full'} key={'group-' + groupNum}>
          <div className={'min-w-min bg-white'}>
            <h3 className='sticky top-0 bg-slate-100 text-center text-slate-400'>&nbsp;</h3>
            {renderDateNums}
          </div>
          <div className={'grid grow grid-cols-4 gap-0.5'}>
            {twelveMonths[groupNum * 4]}
            {twelveMonths[groupNum * 4 + 1]}
            {twelveMonths[groupNum * 4 + 2]}
            {twelveMonths[groupNum * 4 + 3]}
          </div>
        </div>
      )
    })
  }, [generateMonth, renderDateNums, yearNum, yearStartDate])

  return (
    <div className='grow bg-slate-200'>
      <div className={'box-border grid h-full grow grid-cols-3 gap-0.5'}>{months}</div>
    </div>
  )
}
