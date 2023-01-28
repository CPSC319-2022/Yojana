import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { CalendarInterval } from '@/constants/enums'
import dayjs, { Dayjs } from 'dayjs'

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

const convertToDurationKey = (interval: CalendarInterval) => {
  switch (interval) {
    case CalendarInterval.MONTH:
      return 'M'
    case CalendarInterval.WEEK:
      return 'w'
    case CalendarInterval.DAY:
      return 'd'
  }
}

const mainCalendarSlice = createSlice({
  name: 'mainCalendar',
  initialState,
  reducers: {
    setInterval: (state, action: PayloadAction<CalendarInterval>) => {
      state.interval = action.payload
    },
    setDate: (state, action: PayloadAction<Dayjs>) => {
      state.date = action.payload
    },
    incrementDate: (state) => {
      state.date = state.date.add(1, convertToDurationKey(state.interval))
    },
    decrementDate: (state) => {
      state.date = state.date.subtract(1, convertToDurationKey(state.interval))
    }
  }
})

export const { setInterval, decrementDate, setDate, incrementDate } = mainCalendarSlice.actions
export const getInterval = (state: State) => state.mainCalendar.interval
export const getDate = (state: State) => state.mainCalendar.date
export const mainCalendarReducer = mainCalendarSlice.reducer
