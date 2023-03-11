import { CookieValueTypes, setCookie } from 'cookies-next'
import { OptionsType } from 'cookies-next/lib/types'

// This is the same as the setCookie function from cookies-next
// but with a default value of 365 days for the maxAge parameter
export const setCookieMaxAge = (
  key: string,
  data: CookieValueTypes,
  options: OptionsType = {},
  maxAge: number = 365 * 24 * 60 * 60
) => {
  if (options.maxAge === undefined) {
    options.maxAge = maxAge
  }
  setCookie(key, data, options)
}
