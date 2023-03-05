import React from 'react'
import { useController } from 'react-hook-form'

interface DayOfWeekPickerProps {
  control: any
  name: string
  rules?: any
  selectedDays?: DayOfWeek
  setSelectedDays: React.Dispatch<React.SetStateAction<DayOfWeek>>
  updateState?: (cron: string) => void
}

const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
export type DayOfWeek = typeof daysOfWeek

export const DayOfWeekPicker = ({
  control,
  name,
  rules,
  selectedDays = [],
  setSelectedDays,
  updateState = () => {}
}: DayOfWeekPickerProps) => {
  const {
    field: { onChange }
  } = useController({
    name: name,
    control: control,
    rules: rules
  })

  const handleDayChange = (day: string) => {
    const cronexpr = '0 0 * * '
    let days = selectedDays
    if (days.includes(day)) {
      days = days.filter((d) => d !== day)
      setSelectedDays(days)
    } else {
      days = [...days, day]
      setSelectedDays(days)
    }

    if (days.length !== 0) {
      onChange(cronexpr + days.join(','))
      updateState(cronexpr + days.join(','))
    } else {
      onChange('')
      updateState('')
    }
  }

  return (
    <div className='flex flex-wrap justify-center gap-4 pt-3'>
      {daysOfWeek.map((day) => (
        <button
          key={day}
          className={`h-8 w-8 rounded-full text-sm focus:outline-none ${
            selectedDays.includes(day)
              ? 'bg-emerald-100 text-emerald-900'
              : 'bg-white hover:bg-emerald-50 hover:text-emerald-800'
          }`}
          onClick={() => handleDayChange(day)}
          type='button'
        >
          {day.charAt(0)}
        </button>
      ))}
    </div>
  )
}
