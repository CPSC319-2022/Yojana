import { AppData, CategoryFullState, EntryWithoutCategoryId } from '@/types/prisma'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import dayjs, { Dayjs } from 'dayjs'
import { Entry } from '@prisma/client'
import { HYDRATE } from 'next-redux-wrapper'
import { setCookieMaxAge } from '@/utils/cookies'

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
    isMobile: boolean
  }
}

const initialState = {
  data: [] as AppData,
  entryMap: {} as EntryMap,
  isMobile: false
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
      const cat = state.data.find((cat) => cat.id === action.payload.id)
      // return if category doesn't exist
      if (!cat) return
      // update data
      setCookieMaxAge(`yojana.show-category-${action.payload.id}`, cat.show)
      Object.assign(cat, action.payload)
      // update EntryMap
      state.entryMap = _createEntryMap(state.data)
    },
    toggleCategory: (state, action: PayloadAction<number>) => {
      const cat = state.data.find((cat) => cat.id === action.payload)
      // return if category doesn't exist
      if (!cat) return
      setCookieMaxAge(`yojana.show-category-${action.payload}`, !cat.show)
      cat.show = !cat.show
    },
    setCategoriesShow: (state, action: PayloadAction<{ isMaster: boolean; show: boolean }>) => {
      state.data.forEach((cat) => {
        if (cat.isMaster === action.payload.isMaster) {
          setCookieMaxAge(`yojana.show-category-${cat.id}`, action.payload.show)
          cat.show = action.payload.show
        }
      })
    },
    deleteCategory: (state, action: PayloadAction<number>) => {
      const index = state.data.findIndex((cat) => cat.id === action.payload)
      // return if category doesn't exist
      if (index === -1) return
      // update data
      state.data.splice(index, 1)
      // update EntryMap
      state.entryMap = _createEntryMap(state.data)
    },
    setIsMobile: (state, action: PayloadAction<boolean>) => {
      state.isMobile = action.payload
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
    const date = dayjs(entry.date).add(1, 'day')
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

export const {
  setAppData,
  addCategory,
  updateCategory,
  toggleCategory,
  deleteCategory,
  setCategoriesShow,
  setIsMobile
} = appDataSlice.actions

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

export const getIsMobile = (state: State) => {
  return state.appData.isMobile
}

export const appDataReducer = appDataSlice.reducer
