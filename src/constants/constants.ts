import * as process from 'process'

export const DEFAULT_CALLBACK_URL =
  process.env.NODE_ENV === 'production' ? 'https://yojana-main.vercel.app' : 'http://localhost:3000'
