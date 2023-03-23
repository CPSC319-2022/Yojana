import { SelectedSettings } from '@/redux/reducers/DateSelectorReducer'

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
