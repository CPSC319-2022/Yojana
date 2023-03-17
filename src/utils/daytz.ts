import dayjs from 'dayjs'
import 'dayjs/locale/en' // import locale
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'

dayjs.locale('en') // use locale
dayjs.extend(utc)
dayjs.extend(timezone) // extend dayjs with timezone plugin
dayjs.tz.setDefault('America/Vancouver') // set default timezone

export default dayjs
