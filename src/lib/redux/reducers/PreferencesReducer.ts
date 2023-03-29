import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { HYDRATE } from 'next-redux-wrapper'
import { setCookieMaxAge } from '@/utils/cookies'

export type YearOverflow = 'scroll' | 'wrap'
export type MonthCategoryAppearance = 'icons' | 'banners'

interface State {
  preferences: {
    yearOverflow: {
      value: YearOverflow
      cookieName: string
    }
    yearShowGrid: {
      value: boolean
      cookieName: string
    }
    monthCategoryAppearance: {
      value: MonthCategoryAppearance
      cookieName: string
    }
    sidebarOpen: {
      value: boolean
      cookieName: string
    }
    showWeekNumbers: {
      value: boolean
      cookieName: string
    }
    showWorkingHours: {
      value: boolean
      cookieName: string
    }
  }
}

export const defaultPreferences = {
  yearOverflow: {
    value: 'wrap' as YearOverflow,
    cookieName: 'yojana.year-overflow-preference'
  },
  yearShowGrid: {
    value: true,
    cookieName: 'yojana.year-show-grid-preference'
  },
  monthCategoryAppearance: {
    value: 'banners' as MonthCategoryAppearance,
    cookieName: 'yojana.month-category-appearance-preference'
  },
  sidebarOpen: {
    value: true,
    cookieName: 'yojana.sidebar-open'
  },
  showWeekNumbers: {
    value: false,
    cookieName: 'yojana.show-week-numbers'
  },
  showWorkingHours: {
    value: false,
    cookieName: 'yojana.show-working-hours'
  }
}

const preferencesSlice = createSlice({
  name: 'preferences',
  initialState: defaultPreferences,
  reducers: {
    setYearOverflow: (state, action: PayloadAction<YearOverflow>) => {
      state.yearOverflow.value = action.payload
    },
    setYearShowGrid: (state, action: PayloadAction<boolean>) => {
      state.yearShowGrid.value = action.payload
    },
    setMonthCategoryAppearance: (state, action: PayloadAction<MonthCategoryAppearance>) => {
      state.monthCategoryAppearance.value = action.payload
    },
    setIsSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen.value = action.payload
      setCookieMaxAge(state.sidebarOpen.cookieName, action.payload)
    },
    setShowWeekNumbers: (state, action: PayloadAction<boolean>) => {
      state.showWeekNumbers.value = action.payload
    },
    setShowWorkingHours: (state, action: PayloadAction<boolean>) => {
      state.showWorkingHours.value = action.payload
    }
  },
  extraReducers: {
    [HYDRATE]: (state, action: PayloadAction<State>) => {
      return {
        ...state,
        ...action.payload.preferences
      }
    }
  }
})

export const getPreferences = (state: State) => state.preferences
export const {
  setMonthCategoryAppearance,
  setYearShowGrid,
  setYearOverflow,
  setIsSidebarOpen,
  setShowWeekNumbers,
  setShowWorkingHours
} = preferencesSlice.actions
export const preferencesReducer = preferencesSlice.reducer
