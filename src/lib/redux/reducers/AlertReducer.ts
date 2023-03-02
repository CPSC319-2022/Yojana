import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import tcolors from 'tailwindcss/colors'
import { HYDRATE } from 'next-redux-wrapper'

interface State {
  alert: Alert
}

interface Alert {
  message: string
  type: string
  textColor?: string
  backgroundColor?: string
  show: boolean
}

const initialState = {
  message: '',
  show: false,
  type: 'default',
  textColor: '',
  backgroundColor: ''
}

const alertSlice = createSlice({
  name: 'alert',
  initialState,
  reducers: {
    setAlert: (state, action: PayloadAction<Alert>) => {
      state.message = action.payload.message
      state.type = action.payload.type
      state.show = action.payload.show
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

export const getAlert = (state: State) => state.alert
export const { setAlert, setShow } = alertSlice.actions
export const alertReducer = alertSlice.reducer
