/**
 * This file creates the redux store.
 */

import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { mainCalendarReducer } from './reducers/MainCalendarReducer'
import { appDataReducer } from './reducers/AppDataReducer'
import { alertReducer } from '@/redux/reducers/AlertReducer'
import { createWrapper } from 'next-redux-wrapper'
import { DateSelectorReducer } from '@/redux/reducers/DateSelectorReducer'
import { preferencesReducer } from '@/redux/reducers/PreferencesReducer'

const rootReducer = combineReducers({
  mainCalendar: mainCalendarReducer,
  appData: appDataReducer,
  alert: alertReducer,
  dateSelector: DateSelectorReducer,
  preferences: preferencesReducer
})

const makeStore = () =>
  configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        // fixes console error: "A non-serializable value was detected in the state"
        serializableCheck: false
      })
  })

/**
 * The store's type.
 * The store is where the core of the app's state updates take place.
 */
export type AppStore = ReturnType<typeof makeStore>

/**
 * The app's state's type.
 */
export type AppState = ReturnType<AppStore['getState']>

/**
 * The app dispatcher's type.
 * The dispatcher is used to run functions which change the app's state.
 */
export type AppDispatch = AppStore['dispatch']

/**
 * The wrapper bundles information about the store and app state, which React's Provider will use.
 */
export const wrapper = createWrapper<AppStore>(makeStore, {
  // fixes SerializableError: Error serializing `.initialState.mainCalendar.date`
  serializeState: (state) => JSON.stringify(state),
  deserializeState: (state) => JSON.parse(state)
})
