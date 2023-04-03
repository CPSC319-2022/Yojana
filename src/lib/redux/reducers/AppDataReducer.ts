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
    /**
     * Set the app's data (namely, the categories, its metadata, and their corresponding dates).
     * @param state
     * @param action - A list of categories, with their visibility, metadata, and dates.
     */
    setAppData: (state, action: PayloadAction<AppData>) => {
      // update data
      state.data = action.payload
      // update EntryMap
      state.entryMap = _createEntryMap(action.payload)
    },
    /**
     * Add a new category to the list of categories maintained by the store.
     * @param state
     * @param action - a category with its metadata and dates (excluding its visibility).
     */
    addCategory: (state, action: PayloadAction<CategoryFullState>) => {
      setCookieMaxAge(`yojana.show-category-${action.payload.id}`, action.payload.show)
      // update data
      state.data.push(action.payload)
      // add entries to EntryMap
      _addEntriesToEntryMap(state.entryMap, action.payload.entries, action.payload.id)
    },
    /**
     * Update a preexisting category, and set its visibility to `show`.
     * @param state
     * @param action - the category to be updated.
     */
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
    /**
     * Toggle a category's visibility.
     * @param state
     * @param action - the category's id.
     */
    toggleCategory: (state, action: PayloadAction<number>) => {
      const cat = state.data.find((cat) => cat.id === action.payload)
      // return if category doesn't exist
      if (!cat) return
      setCookieMaxAge(`yojana.show-category-${action.payload}`, !cat.show)
      cat.show = !cat.show
    },
    /**
     * For each master OR personal category (as specified by isMaster),
     * set its visibility to the desired visibility.
     *
     * `isMaster` specifies the category group being toggled.
     * - If this value is `true`, then all the master categories' visibilities are being toggled.
     * - If this value is `false, all the personal categories' visibilities are being toggled.
     *
     * `show` specifies whether all the categories in this group should be shown or hidden.
     *
     * @param state
     * @param action - an object with 2 fields: `isMaster` and `show`.
     */
    setCategoriesShow: (state, action: PayloadAction<{ isMaster: boolean; show: boolean }>) => {
      state.data.forEach((cat) => {
        if (cat.isMaster === action.payload.isMaster) {
          setCookieMaxAge(`yojana.show-category-${cat.id}`, action.payload.show)
          cat.show = action.payload.show
        }
      })
    },
    /**
     * Delete the category with the specified id.
     * @param state
     * @param action - the id of the category to be deleted.
     */
    deleteCategory: (state, action: PayloadAction<number>) => {
      const index = state.data.findIndex((cat) => cat.id === action.payload)
      // return if category doesn't exist
      if (index === -1) return
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

// See each function's individual JavaDoc for more information.
export const { setAppData, addCategory, updateCategory, toggleCategory, deleteCategory, setCategoriesShow } =
  appDataSlice.actions

/**
 * Get a category, given its id number. Return null if not found.
 * @param state
 * @param id - the id of the category being queried.
 */
export const getCategory = (state: State, id: number) => {
  const index = state.appData.data.findIndex((cat) => cat.id === id)
  return index !== -1 ? state.appData.data[index] : null
}

/**
 * Get all categories and their metadata (excluding dates).
 * @param state
 */
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

/**
 * Get all categories, along with their dates.
 * This is formatted as an object, where each category's id acts as its key.
 * Returns an empty object if there are no categories.
 * @param state
 */
export const getCategoryMap = (state: State) => {
  return state.appData.data.reduce((acc, cat) => {
    acc[cat.id] = cat
    return acc
  }, {} as CategoryMap)
}

/**
 * Given a date, for each category, get each individual instance which occurs in that date's month.
 * @param state
 * @param date - a date within the month we are interested in.
 */
export const getMonth = (state: State, date: Dayjs) => {
  return state.appData.entryMap[date.year()][date.month()]
}

/**
 * Given a date, for each category, get each individual instance which occurs in that date's month,
 * then do the same for the months before and after it.
 * @param state
 * @param date - a date within the 'current' month we are interested in.
 */
export const getPrevCurrNextMonth = (state: State, date: Dayjs) => {
  const prevMonth = date.subtract(1, 'month')
  const nextMonth = date.add(1, 'month')
  return {
    prevMonth: state.appData.entryMap[prevMonth.year()]?.[prevMonth.month()],
    currMonth: state.appData.entryMap[date.year()]?.[date.month()],
    nextMonth: state.appData.entryMap[nextMonth.year()]?.[nextMonth.month()]
  }
}

/**
 * Given a date, for each category, get each individual instance which occurs in that date's year.
 * @param state
 * @param date - a date within the year we are interested in.
 */
export const getYear = (state: State, date: Dayjs) => {
  return state.appData.entryMap[date.year()]
}

/**
 * Exports this slice to be used in the redux store.
 */
export const appDataReducer = appDataSlice.reducer
