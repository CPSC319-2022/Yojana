import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { mainCalendarReducer } from './reducers/MainCalendarReducer'
import { appDataReducer } from './reducers/AppDataReducer'

const rootReducer = combineReducers({
  mainCalendar: mainCalendarReducer,
  appData: appDataReducer
})

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      // fixes console error: "A non-serializable value was detected in the state"
      serializableCheck: false
    })
})

export type AppState = ReturnType<typeof rootReducer>
export type AppDispatch = typeof store.dispatch
