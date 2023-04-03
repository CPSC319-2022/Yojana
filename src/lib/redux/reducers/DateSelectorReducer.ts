/**
 * Stores state for the date selector.
 *
 * Note that the date selector slice's state is populated when a category is selected for editing.
 * They are subsequently cleared when we exit date selection mode for that category.
 * Therefore, it always only contains dates from either 1 or 0 categories.
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { HYDRATE } from 'next-redux-wrapper'
import dayjs, { Dayjs } from 'dayjs'
import { cloneDeep, merge } from 'lodash'

/**
 * Describes whether a date was selected, and whether it was selected due to being part of a recurring sequence.
 */
export interface SelectedSettings {
  isSelected: boolean
  isRecurring: boolean
}

// year: 2023
// month: 0-11
// day: 1-31
interface DateSelectionMap {
  [year: string]: {
    [month: string]: {
      [day: string]: SelectedSettings
    }
  }
}

interface State {
  dateSelector: {
    isSelectingDates: boolean
    individualDates: DateSelectionMap
    individualDatesAtStart: DateSelectionMap
    repeatingDates: DateSelectionMap
  }
}

const initialState = {
  isSelectingDates: false,
  individualDates: {} as DateSelectionMap,
  individualDatesAtStart: {} as DateSelectionMap,
  repeatingDates: {} as DateSelectionMap
}

const dateSelectorSlice = createSlice({
  name: 'dateSelector',
  initialState,
  reducers: {
    /**
     * Set whether the app is in date selection mode (instead of viewing mode).
     * @param state
     * @param action - `true` to enter date selection mode, `false` to be in date viewing mode.
     */
    setIsSelectingDates: (state, action: PayloadAction<boolean>) => {
      state.isSelectingDates = action.payload
      // If we are starting to select dates, save the current state of individual dates, so we can revert back to it if we cancel
      if (action.payload) {
        state.individualDatesAtStart = cloneDeep(state.individualDates)
      }
    },
    /**
     * Stores the given dates as state.repeatingDates, clearing any dates that had been stored here.
     *
     * Note: this does not enforce that the dates are actually repeating,
     * but to avoid confusion, only store repeating dates here.
     *
     * @param state
     * @param action - A list of entries to be stored, where each entry contains a date & whether it is recurring.
     */
    setRepeatingDates: (state, action: PayloadAction<{ date: string | Date; isRecurring: boolean }[]>) => {
      state.repeatingDates = {}
      _addNewDates(state.repeatingDates, action.payload)
    },
    /**
     * Stores the given dates as state.individualDates, clearing any dates that had been stored here.
     *
     * Note: this does not enforce that the dates are actually non-repeating,
     * but to avoid confusion, only store non-repeating dates here.
     *
     * @param state
     * @param action - A list of entries to be stored, where each entry contains a date & whether it is recurring.
     */
    setIndividualDates: (state, action: PayloadAction<{ date: string | Date; isRecurring: boolean }[]>) => {
      state.individualDates = {}
      _addNewDates(state.individualDates, action.payload)
    },
    /**
     * Set a certain date as selected if it was originally unselected, or vice versa.
     * @param state
     * @param action - the date to toggle selected/unselected for.
     */
    toggleIndividualDate: (state, action: PayloadAction<dayjs.Dayjs>) => {
      const year = action.payload.year()
      const month = action.payload.month()
      const day = action.payload.date()
      if (state.individualDates[year] === undefined) {
        state.individualDates[year] = {}
      }
      if (state.individualDates[year][month] === undefined) {
        state.individualDates[year][month] = {}
      }
      if (state.individualDates[year][month][day] === undefined) {
        state.individualDates[year][month][day] = {
          isSelected: true,
          isRecurring: false
        }
      } else {
        state.individualDates[year][month][day].isSelected = !state.individualDates[year][month][day].isSelected
      }
    },
    /**
     * Revert individual dates back to the state they were in when we started selecting dates.
     * @param state
     */
    cancelDateSelection: (state) => {
      state.individualDates = state.individualDatesAtStart
    },
    /**
     * Clear all selected dates.
     * @param state
     */
    resetSelectedDates: (state) => {
      state.individualDates = {}
      state.individualDatesAtStart = {}
      state.repeatingDates = {}
    }
  },
  extraReducers: {
    [HYDRATE]: (state, action: PayloadAction<State>) => {
      return {
        ...state,
        ...action.payload.dateSelector
      }
    }
  }
})

const _addNewDates = (selectedDates: DateSelectionMap, dates: { date: string | Date; isRecurring: boolean }[]) => {
  dates.forEach(({ date, isRecurring }) => {
    const d = dayjs(date)
    const year = d.year()
    const month = d.month()
    const day = d.date()
    if (selectedDates[year] === undefined) {
      selectedDates[year] = {}
    }
    if (selectedDates[year][month] === undefined) {
      selectedDates[year][month] = {}
    }
    if (selectedDates[year][month][day] === undefined) {
      selectedDates[year][month][day] = {
        isSelected: true,
        isRecurring: isRecurring
      }
    }
  })
}

export const {
  setIsSelectingDates,
  setRepeatingDates,
  toggleIndividualDate,
  resetSelectedDates,
  setIndividualDates,
  cancelDateSelection
} = dateSelectorSlice.actions

/**
 * Get all dates that were selected (both recurring and non-recurring).
 * @param state
 */
export const getSelectedDates = (state: State) => {
  const individualDates = state.dateSelector.individualDates
  const repeatingDates = state.dateSelector.repeatingDates

  const selectedDates = []
  for (const year in individualDates) {
    for (const month in individualDates[year]) {
      for (const day in individualDates[year][month]) {
        if (individualDates[year][month][day].isSelected) {
          selectedDates.push({
            date: `${year}-${Number(month) + 1}-${day}`,
            isRecurring: false
          })
        }
      }
    }
  }
  for (const year in repeatingDates) {
    for (const month in repeatingDates[year]) {
      for (const day in repeatingDates[year][month]) {
        if (repeatingDates[year][month][day].isSelected) {
          selectedDates.push({
            date: `${year}-${Number(month) + 1}-${day}`,
            isRecurring: true
          })
        }
      }
    }
  }
  return selectedDates
}

/**
 * Return whether the webapp is in date selection mode.
 * @param state
 */
export const getIsSelectingDates = (state: State) => state.dateSelector.isSelectingDates

/**
 * Get the selected dates for the month of the target date, as well as the previous and next months.
 * @param state
 * @param date - any date in the 'middle' month.
 */
export const getPrevCurrNextMonthSelectedDates = (state: State, date: Dayjs) => {
  const individualDates = state.dateSelector.individualDates
  const repeatingDates = state.dateSelector.repeatingDates

  const prevMonth = date.subtract(1, 'month')
  const nextMonth = date.add(1, 'month')
  return {
    prevMonthSelected: {
      ...individualDates[prevMonth.year()]?.[prevMonth.month()],
      ...repeatingDates[prevMonth.year()]?.[prevMonth.month()]
    },
    currMonthSelected: {
      ...individualDates[date.year()]?.[date.month()],
      ...repeatingDates[date.year()]?.[date.month()]
    },
    nextMonthSelected: {
      ...individualDates[nextMonth.year()]?.[nextMonth.month()],
      ...repeatingDates[nextMonth.year()]?.[nextMonth.month()]
    }
  }
}

/**
 * Get all selected dates that are in the target date's year.
 * @param state
 * @param date - a date in the year of interest.
 */
export const getYearSelectedDates = (state: State, date: Dayjs) => {
  const individualDates = cloneDeep(state.dateSelector.individualDates[date.year()]) ?? {}
  const repeatingDates = cloneDeep(state.dateSelector.repeatingDates[date.year()]) ?? {}
  return merge(individualDates, repeatingDates)
}

/**
 * Exports this slice to be used in the redux store.
 */
export const DateSelectorReducer = dateSelectorSlice.reducer
