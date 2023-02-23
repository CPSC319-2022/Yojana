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
      cron: cat.cron,
      startDate: cat.startDate,
      endDate: cat.endDate,
      icon: cat.icon,
      creatorId: cat.creator.id
    }
  })

export const getCategoriesOfMonth = (state: State, dateInMonth: Dayjs) => {
  const monthStart = dateInMonth.startOf('month')
  const dates = Array.from({ length: monthStart.daysInMonth() }, (_, i) => monthStart.add(i, 'day'))
  return dates.map((day: Dayjs) =>
    state.appData.data.filter((cat) => {
      return cat.entries.some((entry) => {
        // TODO: Fix this hack to get the correct date, ignore timezones
        return dayjs(entry.date).add(1, 'day').isSame(day, 'day')
      })
    })
  )
}

export const getCategoriesOfYear = (state: State, yearStart: Dayjs) => {
  const months = Array.from(Array(12).keys()).map((num: number) => yearStart.add(num, 'months'))
  return months.map((monthStartDate: Dayjs) => getCategoriesOfMonth(state, monthStartDate))
}

export const appDataReducer = appDataSlice.reducer
