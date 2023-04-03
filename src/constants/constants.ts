import * as process from 'process'

/**
 * The default callback URL for the AD flow.
 * If on production, use the production URL.
 * If on development, use the local URL.
 * @export
 * @enum {string}
 */
export const DEFAULT_CALLBACK_URL =
  process.env.NODE_ENV === 'production' ? 'https://yojana-main.vercel.app' : 'http://localhost:3000'
