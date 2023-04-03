/**
 * A reducer for alerts displayed in the webapp.
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import tcolors from 'tailwindcss/colors'
import { HYDRATE } from 'next-redux-wrapper'
import { getCookie } from 'cookies-next'
import { setCookieMaxAge } from '@/utils/cookies'

interface State {
  alert: Alert
}

interface Alert {
  message: string
  type: string
  show: boolean
  textColor?: string
  backgroundColor?: string
  timeout?: number
}

const initialState = {
  message: '',
  show: false,
  type: 'default',
  textColor: '',
  backgroundColor: '',
  timeout: 5000
}

const alertSlice = createSlice({
  name: 'alert',
  initialState,
  reducers: {
    /**
     * Set the alert that will be stored in the state.
     * @param state
     * @param action - configuration settings for the alert, including its message and colour.
     */
    setAlert: (state, action: PayloadAction<Alert & { cookieName?: string; showOnce?: boolean }>) => {
      if (action.payload.cookieName) {
        const show = getCookie(`yojana.show-${action.payload.cookieName}-alert`)
        if (show === false) {
          return
        }

        if (action.payload.showOnce !== undefined) {
          setCookieMaxAge(`yojana.show-${action.payload.cookieName}-alert`, !action.payload.showOnce)
        }
      }

      state.message = action.payload.message
      state.type = action.payload.type
      state.show = action.payload.show
      state.timeout = action.payload.timeout || 5000
      switch (action.payload.type) {
        case 'success':
          state.textColor = tcolors.green[700]
          state.backgroundColor = tcolors.green[200]
          break
        case 'error':
          state.textColor = tcolors.red[700]
          state.backgroundColor = tcolors.red[200]
          break
        case 'warning':
          state.textColor = tcolors.yellow[700]
          state.backgroundColor = tcolors.yellow[200]
          break
        case 'info':
          state.textColor = tcolors.blue[700]
          state.backgroundColor = tcolors.blue[200]
          break
        default:
          state.textColor = tcolors.slate[800]
          state.backgroundColor = tcolors.slate[200]
          break
      }
    },
    /**
     * Show or hide the state's alert.
     * @param state
     * @param action - `true` to show the alert, `false` to hide it.
     */
    setShow: (state, action: PayloadAction<boolean>) => {
      state.show = action.payload
    }
  },
  extraReducers: {
    [HYDRATE]: (state, action: PayloadAction<State>) => {
      return {
        ...state,
        ...action.payload.alert
      }
    }
  }
})

/**
 * Get the alert which was set into the state
 *
 * @param state
 */
export const getAlert = (state: State) => state.alert

// See each function's individual JavaDoc for more information.
export const { setAlert, setShow } = alertSlice.actions

/**
 * Exports this slice to be used in the redux store.
 */
export const alertReducer = alertSlice.reducer
