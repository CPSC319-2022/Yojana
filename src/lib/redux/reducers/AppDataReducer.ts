import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppData, CategoryFullState } from '@/types/prisma'
import dayjs, { Dayjs } from 'dayjs'
import { setCookie } from 'cookies-next'

interface State {
  appData: {
    data: AppData
  }
}

const initialState = {
  data: [] as AppData
}

const appDataSlice = createSlice({
  name: 'appData',
  initialState,
  reducers: {
    setAppData: (state, action: PayloadAction<AppData>) => {
      state.data = action.payload
    },
    addCategory: (state, action: PayloadAction<CategoryFullState>) => {
      setCookie(`yojana.show-category-${action.payload.id}`, action.payload.show)
      state.data.push(action.payload)
    },
    updateCategory: (state, action: PayloadAction<CategoryFullState>) => {
      setCookie(`yojana.show-category-${action.payload.id}`, action.payload.show)
      const index = state.data.findIndex((cat) => cat.id === action.payload.id)
      state.data[index] = action.payload
    },
    toggleCategory: (state, action: PayloadAction<number>) => {
      const index = state.data.findIndex((cat) => cat.id === action.payload)
      setCookie(`yojana.show-category-${action.payload}`, !state.data[index].show)
      state.data[index].show = !state.data[index].show
    }
  }
})

export const { setAppData, addCategory, updateCategory, toggleCategory } = appDataSlice.actions
export const getCategories = (state: State) =>
  state.appData.data.map((cat) => {
    return {
      id: cat.id,
      name: cat.name,
      description: cat.description,
      color: cat.color,
      isMaster: cat.isMaster,
      show: cat.show,
      icon: cat.icon,
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
