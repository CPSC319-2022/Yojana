import { AppData, CategoryFullState, EntryWithoutCategoryId } from '@/types/prisma'
import { setCookieMaxAge } from '@/utils/cookies'
import { default as daytz } from '@/utils/daytz'
import { Entry } from '@prisma/client'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Dayjs } from 'dayjs'
import { HYDRATE } from 'next-redux-wrapper'

// year: 2023
// month: 0-11
// day: 1-31
interface EntryMap {
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
    entryMap: EntryMap
  }
}

const initialState = {
  data: [] as AppData,
  entryMap: {} as EntryMap
}

const appDataSlice = createSlice({
  name: 'appData',
  initialState,
  reducers: {
    setAppData: (state, action: PayloadAction<AppData>) => {
      // update data
      state.data = action.payload
      // update EntryMap
      state.entryMap = _createEntryMap(action.payload)
    },
    addCategory: (state, action: PayloadAction<CategoryFullState>) => {
      setCookieMaxAge(`yojana.show-category-${action.payload.id}`, action.payload.show)
      // update data
      state.data.push(action.payload)
      // add entries to EntryMap
      _addEntriesToEntryMap(state.entryMap, action.payload.entries, action.payload.id)
    },
    updateCategory: (state, action: PayloadAction<CategoryFullState>) => {
      const index = state.data.findIndex((cat) => cat.id === action.payload.id)
      // update data
      const previousShow = state.data[index].show
      setCookieMaxAge(`yojana.show-category-${action.payload.id}`, state.data[index].show)
      state.data[index] = action.payload
      state.data[index].show = previousShow
      // update EntryMap
      state.entryMap = _createEntryMap(state.data)
    },
    toggleCategory: (state, action: PayloadAction<number>) => {
      const index = state.data.findIndex((cat) => cat.id === action.payload)
      setCookieMaxAge(`yojana.show-category-${action.payload}`, !state.data[index].show)
      state.data[index].show = !state.data[index].show
    },
    deleteCategory: (state, action: PayloadAction<number>) => {
      const index = state.data.findIndex((cat) => cat.id === action.payload)
      // update data
      state.data.splice(index, 1)
      // update EntryMap
      state.entryMap = _createEntryMap(state.data)
    }
  },
  extraReducers: {
    [HYDRATE]: (state, action: PayloadAction<State>) => {
      return {
        ...state,
        ...action.payload.appData
      }
    }
  }
})

const _createEntryMap = (data: AppData) => {
  return data.reduce((acc, cat) => {
    // return the accumulator with the new entries added
    return _addEntriesToEntryMap(acc, cat.entries, cat.id)
  }, {} as EntryMap)
}

const _addEntriesToEntryMap = (entryMap: EntryMap, entries: EntryWithoutCategoryId[], categoryId: number) => {
  entries.forEach((entry) => {
    // TODO: Fix this hack to get the correct date, ignore timezones
    const date = daytz.tz(entry.date)
    const year = date.year() // 2023
    const month = date.month() // 0-11
    const day = date.date() // 1-31
    // create year if it doesn't exist
    if (!entryMap[year]) {
      entryMap[year] = {}
    }
    // create month if it doesn't exist
    if (!entryMap[year][month]) {
      entryMap[year][month] = {}
    }
    // create day if it doesn't exist
    if (!entryMap[year][month][day]) {
      entryMap[year][month][day] = []
    }
    // add entry to day
    entryMap[year][month][day].push({
      id: entry.id,
      date: entry.date,
      isRecurring: entry.isRecurring,
      categoryId: categoryId
    })
  })
  return entryMap
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

export const getMonth = (state: State, date: Dayjs) => {
  return state.appData.entryMap[date.year()][date.month()]
}

export const getPrevCurrNextMonth = (state: State, date: Dayjs) => {
  const prevMonth = date.subtract(1, 'month')
  const nextMonth = date.add(1, 'month')
  return {
    prevMonth: state.appData.entryMap[prevMonth.year()]?.[prevMonth.month()],
    currMonth: state.appData.entryMap[date.year()]?.[date.month()],
    nextMonth: state.appData.entryMap[nextMonth.year()]?.[nextMonth.month()]
  }
}

export const getYear = (state: State, date: Dayjs) => {
  return state.appData.entryMap[date.year()]
}

export const appDataReducer = appDataSlice.reducer
