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

export type AppStore = ReturnType<typeof makeStore>
export type AppState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']
export const wrapper = createWrapper<AppStore>(makeStore, {
  // fixes SerializableError: Error serializing `.initialState.mainCalendar.date`
  serializeState: (state) => JSON.stringify(state),
  deserializeState: (state) => JSON.parse(state)
})
