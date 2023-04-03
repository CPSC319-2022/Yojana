/**
 * Reusable helper functions related to cookies in the app
 */

import { CookieValueTypes, setCookie } from 'cookies-next'
import { OptionsType } from 'cookies-next/lib/types'

/**
 * Used for setting a cookie with the maximum expiry age.
 *
 * This is the same as the setCookie function from cookies-next
 * but with a default value of 365 days for the maxAge parameter
 *
 * @param key - the cookie's key
 * @param data - the value of the cookie
 * @param options - cookie serializing options for NextJS
 * @param maxAge - the max age of the cookie. Defaults to 365 days.
 */
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
