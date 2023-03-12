import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { HYDRATE } from 'next-redux-wrapper'
import dayjs, { Dayjs } from 'dayjs'
import { cloneDeep, merge } from 'lodash'

// year: 2023
// month: 0-11
// day: 1-31
interface DateSelectionMap {
  [year: string]: {
    [month: string]: {
      [day: string]: {
        isSelected: boolean
        isRepeating: boolean
      }
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
    setIsSelectingDates: (state, action: PayloadAction<boolean>) => {
      state.isSelectingDates = action.payload
      // If we are starting to select dates, save the current state of individual dates, so we can revert back to it if we cancel
      if (action.payload) {
        state.individualDatesAtStart = cloneDeep(state.individualDates)
      }
    },
    setRepeatingDates: (state, action: PayloadAction<{ date: string | Date; isRepeating: boolean }[]>) => {
      state.repeatingDates = {}
      _addNewDates(state.repeatingDates, action.payload)
    },
    setIndividualDates: (state, action: PayloadAction<{ date: string | Date; isRepeating: boolean }[]>) => {
      state.individualDates = {}
      _addNewDates(state.individualDates, action.payload)
    },
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
          isRepeating: false
        }
      } else {
        state.individualDates[year][month][day].isSelected = !state.individualDates[year][month][day].isSelected
      }
    },
    cancelDateSelection: (state) => {
      // Revert individual dates back to the state they were in when we started selecting dates
      state.individualDates = state.individualDatesAtStart
    },
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

const _addNewDates = (selectedDates: DateSelectionMap, dates: { date: string | Date; isRepeating: boolean }[]) => {
  dates.forEach(({ date, isRepeating }) => {
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
        isRepeating: isRepeating
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
            isRepeating: false
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
            isRepeating: true
          })
        }
      }
    }
  }
  return selectedDates
}

export const getIsSelectingDates = (state: State) => state.dateSelector.isSelectingDates

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

export const getYearSelectedDates = (state: State, date: Dayjs) => {
  const individualDates = cloneDeep(state.dateSelector.individualDates[date.year()]) ?? {}
  const repeatingDates = cloneDeep(state.dateSelector.repeatingDates[date.year()]) ?? {}
  return merge(individualDates, repeatingDates)
}

export const DateSelectorReducer = dateSelectorSlice.reducer
