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
    },
    addCategory: (state, action: PayloadAction<AppData>) => {
      state.data.push(action.payload)
    }
  }
})

export const { setAppData, addCategory } = appDataSlice.actions
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

export const getCategoriesOfMonth = (state: State, dateInMonth: Dayjs) => {
  const monthStart = dateInMonth.startOf('month')
  const dates = Array.from(Array(dateInMonth.daysInMonth()).keys()).map((num: number) => monthStart.add(num, 'days'))
  return dates.map((day: Dayjs) =>
    state.appData.data.filter((cat) => {
      return cat.entries.some((entry) => {
        return dayjs(entry.date).isSame(day, 'day')
      })
    })
  )
}

export const appDataReducer = appDataSlice.reducer
