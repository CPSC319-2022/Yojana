/**
 * Reducer for state pertaining to the calendar views' operation
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { CalendarInterval } from '@/constants/enums'
import dayjs, { Dayjs } from 'dayjs'
import { intervalToNumMonths } from '@/utils/month'
import { HYDRATE } from 'next-redux-wrapper'

interface State {
  mainCalendar: {
    interval: CalendarInterval
    date: number
  }
}

const initialState = {
  interval: CalendarInterval.YEAR_SCROLL,
  date: dayjs().unix()
}

const mainCalendarSlice = createSlice({
  name: 'mainCalendar',
  initialState,
  reducers: {
    /**
     * Set the view to be displayed in the main calendar.
     * @param state
     * @param action - a view, such as Month or Quarterly.
     */
    setInterval: (state, action: PayloadAction<CalendarInterval>) => {
      state.interval = action.payload
    },
    /**
     * Set the target date (i.e. the date that must be displayed).
     * @param state
     * @param action - the date to be included in the current view.
     */
    setDate: (state, action: PayloadAction<Dayjs>) => {
      state.date = action.payload.unix()
    },
    /**
     * Increment the target date by a certain interval.
     * The interval corresponds to which view the main calendar is displaying;
     * for example, if it was a year view, the target date would be increased by 12 months.
     * @param state
     */
    incrementDate: (state) => {
      state.date = dayjs.unix(state.date).add(intervalToNumMonths(state.interval), 'M').unix()
    },
    /**
     * Decrement the target date by a certain interval.
     * The interval corresponds to which view the main calendar is displaying;
     * for example, if it was a year view, the target date would be increased by 12 months.
     * @param state
     */
    decrementDate: (state) => {
      state.date = dayjs.unix(state.date).subtract(intervalToNumMonths(state.interval), 'M').unix()
    },
    /**
     * Set the current date to today's date.
     * @param state
     */
    jumpToToday: (state) => {
      state.date = dayjs().unix()
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

export const { setInterval, decrementDate, setDate, incrementDate, jumpToToday } = mainCalendarSlice.actions

/**
 * Get the current main calendar view (e.g. 4-month, Quarterly, or Month).
 * @param state
 */
export const getInterval = (state: State) => state.mainCalendar.interval

/**
 * Return whether the current view is Year (Vertical).
 * @param state
 */
export const isYearInterval = (state: State) => state.mainCalendar.interval === CalendarInterval.YEAR

/**
 * Return whether the current view is Year (Classic).
 * @param state
 */
export const isYearScrollInterval = (state: State) => state.mainCalendar.interval === CalendarInterval.YEAR_SCROLL

/**
 * Return whether the current view is Quarterly (3-month) view.
 * @param state
 */
export const isQuarterlyInterval = (state: State) => state.mainCalendar.interval === CalendarInterval.QUARTERLY

/**
 * Return whether the current view is 4-month view.
 * @param state
 */
export const isFourMonthInterval = (state: State) => state.mainCalendar.interval === CalendarInterval.FOUR_MONTHS

/**
 * Return whether the current view is Month view.
 * @param state
 */
export const isMonthInterval = (state: State) => state.mainCalendar.interval === CalendarInterval.MONTH

/**
 * Return the target date.
 * @param state
 */
export const getDate = (state: State) => dayjs.unix(state.mainCalendar.date)

/**
 * Exports this slice to be used in the redux store.
 */
export const mainCalendarReducer = mainCalendarSlice.reducer
