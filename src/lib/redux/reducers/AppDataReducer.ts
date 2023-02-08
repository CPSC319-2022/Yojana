import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppData } from '@/types/AppData'
import dayjs, { Dayjs } from 'dayjs'

interface State {
  appData: {
    data: AppData[]
  }
}

const initialState = {
  data: [] as AppData[]
}

const appDataSlice = createSlice({
  name: 'appData',
  initialState,
  reducers: {
    setAppData: (state, action: PayloadAction<AppData[]>) => {
      state.data = action.payload
    }
  }
})

export const { setAppData } = appDataSlice.actions
export const getAppData = (state: State) => state.appData.data
export const getCategories = (state: State) =>
  state.appData.data.map((cat) => {
    return {
      id: cat.id,
      name: cat.name,
      description: cat.description,
      color: cat.color,
      isMaster: cat.isMaster,
      creatorId: cat.creator.id
    }
  })

export const getCategoriesOnDate = (state: State, date: Dayjs) =>
  state.appData.data.filter((cat) => {
    return cat.entries.some((entry) => {
      return dayjs(entry.date).isSame(date, 'day')
    })
  })

export const appDataReducer = appDataSlice.reducer
