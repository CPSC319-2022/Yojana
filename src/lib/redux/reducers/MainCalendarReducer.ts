import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { CalendarInterval } from '@/constants/enums'
import dayjs, { Dayjs } from 'dayjs'
import { intervalToNumMonths } from '@/utils/month'
import { HYDRATE } from 'next-redux-wrapper'

interface State {
  mainCalendar: {
    interval: CalendarInterval
    date: number
    gridPreferences: boolean
    yearPreferences: boolean
  }
}

const initialState = {
  interval: CalendarInterval.YEAR,
  date: dayjs().unix(),
  gridPreferences: true,
  yearPreferences: true
}

const mainCalendarSlice = createSlice({
  name: 'mainCalendar',
  initialState,
  reducers: {
    setInterval: (state, action: PayloadAction<CalendarInterval>) => {
      state.interval = action.payload
    },
    setDate: (state, action: PayloadAction<Dayjs>) => {
      state.date = action.payload.unix()
    },
    incrementDate: (state) => {
      state.date = dayjs.unix(state.date).add(intervalToNumMonths(state.interval), 'M').unix()
    },
    decrementDate: (state) => {
      state.date = dayjs.unix(state.date).subtract(intervalToNumMonths(state.interval), 'M').unix()
    },
    jumpToToday: (state) => {
      state.date = dayjs().unix()
    },
    setGridPreferences: (state, action: PayloadAction<boolean>) => {
      state.gridPreferences = action.payload
    },
    setYearPreferences: (state, action: PayloadAction<boolean>) => {
      state.yearPreferences = action.payload
    }
  },
  extraReducers: {
    [HYDRATE]: (state, action: PayloadAction<State>) => {
      return {
        ...state,
        ...action.payload.mainCalendar
      }
    }
  }
})

export const {
  setInterval,
  decrementDate,
  setDate,
  incrementDate,
  jumpToToday,
  setGridPreferences,
  setYearPreferences
} = mainCalendarSlice.actions
export const getInterval = (state: State) => state.mainCalendar.interval
export const isYearInterval = (state: State) => state.mainCalendar.interval === CalendarInterval.YEAR
export const isMonthInterval = (state: State) => state.mainCalendar.interval === CalendarInterval.MONTH
export const getDate = (state: State) => dayjs.unix(state.mainCalendar.date)
export const mainCalendarReducer = mainCalendarSlice.reducer
export const getGridPreference = (state: State) => {
  return state.mainCalendar.gridPreferences
}
export const getYearPreference = (state: State) => {
  return state.mainCalendar.yearPreferences
}
