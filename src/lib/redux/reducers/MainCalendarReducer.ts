import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { CalendarInterval } from '@/constants/enums'
import dayjs, { Dayjs } from 'dayjs'
import { convertToDurationKey } from '@/utils/month'

interface State {
  mainCalendar: {
    interval: CalendarInterval
    date: Dayjs
  }
}

const initialState = {
  interval: CalendarInterval.MONTH,
  date: dayjs()
}

const mainCalendarSlice = createSlice({
  name: 'mainCalendar',
  initialState,
  reducers: {
    setInterval: (state, action: PayloadAction<CalendarInterval>) => {
      state.interval = action.payload
      localStorage.setItem('CalendarInterval', action.payload)
    },
    setDate: (state, action: PayloadAction<Dayjs>) => {
      state.date = action.payload
    },
    incrementDate: (state) => {
      state.date = state.date.add(convertToDurationKey(state.interval), 'M')
    },
    decrementDate: (state) => {
      state.date = state.date.subtract(convertToDurationKey(state.interval), 'M')
    }
  }
})

export const { setInterval, decrementDate, setDate, incrementDate } = mainCalendarSlice.actions
export const getInterval = (state: State) => state.mainCalendar.interval
export const getDate = (state: State) => state.mainCalendar.date
export const mainCalendarReducer = mainCalendarSlice.reducer
