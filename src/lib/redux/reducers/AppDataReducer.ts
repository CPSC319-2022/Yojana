import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppData, CategoryFull, CategoryFullState } from '@/types/prisma'
import dayjs, { Dayjs } from 'dayjs'

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
    setAppData: (state, action: PayloadAction<CategoryFull[]>) => {
      state.data = action.payload.map((cat) => {
        return {
          // Add show property to each category
          // This is used to toggle the visibility of the category in the calendar
          // TODO: use cookies to save the show property for each category
          //       so that the user can set the default visibility of each category
          //       consider moving this to the backend, in getServersideProps in index.tsx
          show: true,
          ...cat
        }
      })
    },
    addCategory: (state, action: PayloadAction<CategoryFullState>) => {
      state.data.push(action.payload)
    },
    updateCategory: (state, action: PayloadAction<CategoryFullState>) => {
      const index = state.data.findIndex((cat) => cat.id === action.payload.id)
      state.data[index] = action.payload
    },
    toggleCategory: (state, action: PayloadAction<number>) => {
      const index = state.data.findIndex((cat) => cat.id === action.payload)
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
