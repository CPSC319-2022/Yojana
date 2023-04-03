/**
 * Reusable helper functions related to colours in the app
 */

import { hex } from 'wcag-contrast'

/**
 * Used for determining text colour, given the background colour of the text.
 *
 * Returns text-white or text-slate-800 depending on the contrast ratio.
 * a contrast ratio of 4.5 is the minimum for WCAG AA compliance
 * by checking if bgColor contrast ratio with white is greater than 4.5 we can determine if the text should be white or black
 *
 * @param bgColor - the background colour of the target text
 */
export const getTextColor = (bgColor: string) => {
  return hex(bgColor, '#ffffff') > 4.5 ? 'text-white' : 'text-slate-800'
}

/**
 * Generate a random hex color
 * https://stackoverflow.com/a/5092846/8488681
 */
export const randomColor = () => {
  return '#' + ((Math.random() * 0xffffff) << 0).toString(16).padStart(6, '0')
}
