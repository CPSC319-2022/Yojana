import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { mainCalendarReducer } from './reducers/MainCalendarReducer'
import { appDataReducer } from './reducers/AppDataReducer'
import { alertReducer } from '@/redux/reducers/AlertReducer'
import { createWrapper } from 'next-redux-wrapper'
import dayjs from 'dayjs'

const rootReducer = combineReducers({
  mainCalendar: mainCalendarReducer,
  appData: appDataReducer,
  alert: alertReducer
})

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      // fixes console error: "A non-serializable value was detected in the state"
      serializableCheck: false
    })
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

export type AppStore = ReturnType<typeof makeStore>
export type AppState = ReturnType<typeof rootReducer>
export type AppDispatch = typeof store.dispatch
export const wrapper = createWrapper<AppStore>(makeStore, {
  // fixes SerializableError: Error serializing `.initialState.mainCalendar.date`
  serializeState: (state) => JSON.stringify(state),
  deserializeState: (state) => {
    const deserializedState = JSON.parse(state)
    // ensures that the date is a dayjs object and not a string
    if (deserializedState.mainCalendar.date) {
      deserializedState.mainCalendar.date = dayjs(deserializedState.mainCalendar.date)
    } else {
      deserializedState.mainCalendar.date = dayjs()
    }
    return deserializedState
  }
})
