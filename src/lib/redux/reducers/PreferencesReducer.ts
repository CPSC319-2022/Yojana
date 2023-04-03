/**
 * Reducer for state pertaining to user preferences & the preference modal.
 */
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
  }
}

const preferencesSlice = createSlice({
  name: 'preferences',
  initialState: defaultPreferences,
  reducers: {
    /**
     * Whether overflowing icons in Year (Vertical) should `wrap`, or should horizontally `scroll`
     * @param state
     * @param action - `wrap` or `scroll`
     */
    setYearOverflow: (state, action: PayloadAction<YearOverflow>) => {
      state.yearOverflow.value = action.payload
    },
    /**
     * Whether the grid in Year (Vertical) should be shown (`true`) or hidden (`false`)
     * @param state
     * @param action - `true` to show grid, `false` to hide it.
     */
    setYearShowGrid: (state, action: PayloadAction<boolean>) => {
      state.yearShowGrid.value = action.payload
    },
    /**
     * Whether categories in Month view should be displayed as `icons` or `banners`
     * @param state
     * @param action - `icons` or `banners`
     */
    setMonthCategoryAppearance: (state, action: PayloadAction<MonthCategoryAppearance>) => {
      state.monthCategoryAppearance.value = action.payload
    },
    /**
     * Whether the sidebar is open.
     * @param state
     * @param action - whether to display sidebar.
     */
    setIsSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen.value = action.payload
      setCookieMaxAge(state.sidebarOpen.cookieName, action.payload)
    },
    /**
     * Whether to show week numbers at the right edge.
     * Applicable to all views except Year (Vertical).
     * @param state
     * @param action - `true` to show week numbers, `false` to hide them.
     */
    setShowWeekNumbers: (state, action: PayloadAction<boolean>) => {
      state.showWeekNumbers.value = action.payload
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

/**
 * Get all user preferences stored in this slice.
 * @param state
 */
export const getPreferences = (state: State) => state.preferences

// See each function's individual JavaDoc for more information.
export const { setMonthCategoryAppearance, setYearShowGrid, setYearOverflow, setIsSidebarOpen, setShowWeekNumbers } =
  preferencesSlice.actions

/**
 * Exports this slice to be used in the redux store.
 */
export const preferencesReducer = preferencesSlice.reducer
