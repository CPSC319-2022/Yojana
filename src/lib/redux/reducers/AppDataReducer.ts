import { AppData, CategoryFullState, EntryWithoutCategoryId } from '@/types/prisma'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { setCookie } from 'cookies-next'
import dayjs, { Dayjs } from 'dayjs'
import { Entry } from '@prisma/client'

interface YearMap {
  [year: string]: {
    [month: string]: {
      [day: string]: Entry[]
    }
  }
}

interface CategoryMap {
  [categoryId: number]: CategoryFullState
}

interface State {
  appData: {
    data: AppData
    yearMap: YearMap
  }
}

const initialState = {
  data: [] as AppData,
  yearMap: {} as YearMap
}

const appDataSlice = createSlice({
  name: 'appData',
  initialState,
  reducers: {
    setAppData: (state, action: PayloadAction<AppData>) => {
      // update data
      state.data = action.payload
      // update YearMap
      state.yearMap = _createYearMap(action.payload)
    },
    addCategory: (state, action: PayloadAction<CategoryFullState>) => {
      setCookie(`yojana.show-category-${action.payload.id}`, action.payload.show)
      // update data
      state.data.push(action.payload)
      // add entries to YearMap
      _addEntriesToYearMap(state.yearMap, action.payload.entries, action.payload.id)
    },
    updateCategory: (state, action: PayloadAction<CategoryFullState>) => {
      setCookie(`yojana.show-category-${action.payload.id}`, action.payload.show)
      const index = state.data.findIndex((cat) => cat.id === action.payload.id)
      // update data
      state.data[index] = action.payload
      // update YearMap
      state.yearMap = _createYearMap(state.data)
    },
    toggleCategory: (state, action: PayloadAction<number>) => {
      const index = state.data.findIndex((cat) => cat.id === action.payload)
      setCookie(`yojana.show-category-${action.payload}`, !state.data[index].show)
      state.data[index].show = !state.data[index].show
    },
    deleteCategory: (state, action: PayloadAction<number>) => {
      const index = state.data.findIndex((cat) => cat.id === action.payload)
      // update data
      state.data.splice(index, 1)
      // update YearMap
      state.yearMap = _createYearMap(state.data)
    }
  }
})

const _createYearMap = (data: AppData) => {
  return data.reduce((acc, cat) => {
    // return the accumulator with the new entries added
    return _addEntriesToYearMap(acc, cat.entries, cat.id)
  }, {} as YearMap)
}

const _addEntriesToYearMap = (yearMap: YearMap, entries: EntryWithoutCategoryId[], categoryId: number) => {
  entries.forEach((entry) => {
    const date = dayjs(entry.date)
    const year = date.year()
    const month = date.month()
    const day = date.date()
    // create year if it doesn't exist
    if (!yearMap[year]) {
      yearMap[year] = {}
    }
    // create month if it doesn't exist
    if (!yearMap[year][month]) {
      yearMap[year][month] = {}
    }
    // create day if it doesn't exist
    if (!yearMap[year][month][day]) {
      yearMap[year][month][day] = []
    }
    // add entry to day
    yearMap[year][month][day].push({
      id: entry.id,
      date: dayjs(dayjs(entry.date).toISOString().split('T')[0]).toDate(),
      isRepeating: entry.isRepeating,
      categoryId: categoryId
    })
  }, {} as YearMap)
  return yearMap
}

export const { setAppData, addCategory, updateCategory, toggleCategory, deleteCategory } = appDataSlice.actions

export const getCategory = (state: State, id: number) => {
  const index = state.appData.data.findIndex((cat) => cat.id === id)
  return index !== -1 ? state.appData.data[index] : null
}

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

export const getCategoryMap = (state: State) => {
  return state.appData.data.reduce((acc, cat) => {
    acc[cat.id] = cat
    return acc
  }, {} as CategoryMap)
}

export const getEntriesInMonth = (state: State, date: Dayjs) => {
  return state.appData.yearMap[date.year()][date.month()]
}

export const getEntriesInYear = (state: State, date: Dayjs) => {
  return state.appData.yearMap[date.year()]
}

export const appDataReducer = appDataSlice.reducer
