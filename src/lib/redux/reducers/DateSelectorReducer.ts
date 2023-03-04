import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import dayjs, { Dayjs } from 'dayjs'
import { HYDRATE } from 'next-redux-wrapper'

interface State {
  dateSelector: {
    isSelectingDates: boolean
    selectedDates: dayjs.Dayjs[]
  }
}

const initialState = {
  isSelectingDates: false,
  selectedDates: [] as Dayjs[]
}

const dateSelectorSlice = createSlice({
  name: 'dateSelector',
  initialState,
  reducers: {
    setIsSelectingDates: (state, action: PayloadAction<boolean>) => {
      state.isSelectingDates = action.payload
    },
    setSelectedDates: (state, action: PayloadAction<Dayjs[]>) => {
      state.selectedDates = action.payload
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

export const { setIsSelectingDates, setSelectedDates } = dateSelectorSlice.actions

export const getIsSelectingDates = (state: State) => state.dateSelector.isSelectingDates

export const DateSelectorReducer = dateSelectorSlice.reducer
