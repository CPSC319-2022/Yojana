/**
 * Reusable helper functions related to displaying individual days in the app
 */
import { SelectedSettings } from '@/redux/reducers/DateSelectorReducer'

/**
 * Generates the styling for a particular day.
 *
 * Notably,
 * - If not selecting dates, weekends are shaded gray
 * - If selecting dates
 *   - All unselected dates are white
 *   - All selected recurring dates are striped green
 *   - All selected non-recurring dates are solid green
 *   - Any hovered date will get a hover ring
 *
 * @param dayOfWeek - the weekday (0-6, 0 is Sunday and 6 is Saturday)
 * @param isSelectingDates - whether the user is editing selected dates (as opposed to viewing them)
 * @param selected - the associated date object. Indicates whether the date is selected and/or recurring.
 */
export const getDayStyling = (dayOfWeek: number, isSelectingDates: boolean, selected?: SelectedSettings) => {
  let styleString: string[] = []
  if (isSelectingDates) {
    if (selected?.isRecurring) {
      styleString.push('bg-stripes bg-stripes-c1-emerald-100 bg-stripes-c2-white')
    } else {
      styleString.push(selected?.isSelected ? 'bg-[#d9fae9]' : 'bg-white')
      styleString.push('cursor-pointer hover:ring-2 hover:ring-inset hover:ring-emerald-200')
    }
  } else {
    styleString.push(dayOfWeek < 6 && dayOfWeek > 0 ? 'bg-white' : 'bg-slate-100') // weekday or weekend
  }
  return styleString.join(' ')
}
