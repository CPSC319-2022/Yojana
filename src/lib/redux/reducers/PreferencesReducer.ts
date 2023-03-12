import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { HYDRATE } from 'next-redux-wrapper'

export type YearOverflow = 'scroll' | 'expand'
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
  }
}

export const defaultPreferences = {
  yearOverflow: {
    value: 'expand' as YearOverflow,
    cookieName: 'yojana.year-overflow-preference'
  },
  yearShowGrid: {
    value: true,
    cookieName: 'yojana.year-show-grid-preference'
  },
  monthCategoryAppearance: {
    value: 'banners' as MonthCategoryAppearance,
    cookieName: 'yojana.month-category-appearance-preference'
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
export const { setMonthCategoryAppearance, setYearShowGrid, setYearOverflow } = preferencesSlice.actions
export const preferencesReducer = preferencesSlice.reducer
