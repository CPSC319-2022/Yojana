import { hex } from 'wcag-contrast'

// returns text-white or text-black depending on the contrast ratio
// a contrast ratio of 4.5 is the minimum for WCAG AA compliance
// by checking if bgColor contrast ratio with white is greater than 4.5 we can determine if the text should be white or black
export const getTextColor = (bgColor: string) => {
  return hex(bgColor, '#ffffff') > 4.5 ? 'text-white' : 'text-black'
}

// generate a random hex color
// 16777215 is the max value for a hex color (#ffffff)
export const randomColor = () => {
  return '#' + Math.floor(Math.random() * 16777215).toString(16)
}
