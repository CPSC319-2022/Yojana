import { Alert } from '@/components/common'
import { MainCalendar } from '@/components/mainCalendar'
import { NavBar } from '@/components/navBar'
import { SideBar } from '@/components/sideBar/'
import { CalendarInterval } from '@/constants/enums'
import { getCategories, getCategoriesWithoutEntries } from '@/prisma/queries'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { setAppData, updateAppData } from '@/redux/reducers/AppDataReducer'
import { getIsSelectingDates, resetSelectedDates, setIsSelectingDates } from '@/redux/reducers/DateSelectorReducer'
import { setDate, setInterval } from '@/redux/reducers/MainCalendarReducer'
import { wrapper } from '@/redux/store'
import { getCookies } from 'cookies-next'
import dayjs from 'dayjs'
import { GetServerSideProps } from 'next'
import { getServerSession, Session } from 'next-auth'
import { useEffect, useState } from 'react'
import { authOptions } from './api/auth/[...nextauth]'
import { setCookieMaxAge } from '@/utils/cookies'
import { defaultPreferences, setYearOverflow, setYearShowGrid } from '@/redux/reducers/PreferencesReducer'
import z from 'zod'
import { CategoryFull } from '@/types/prisma'

interface CalendarProps {
  sidebarOpenInitial: boolean
  session: Session
}

const Calendar = ({ sidebarOpenInitial, session }: CalendarProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(sidebarOpenInitial)
  const dispatch = useAppDispatch()
  const isSelectingDates = useAppSelector((state) => getIsSelectingDates(state))

  // get complete AppData from database on initial render
  useEffect(() => {
    const getAllAppData = async () => {
      const response = await fetch(`/api/cats?userID=${session?.user.id}`)
      const categories: CategoryFull[] = await response.json()
      dispatch(updateAppData(categories))
    }
    getAllAppData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // reset selected dates when sidebar is closed while in date selection mode
  useEffect(() => {
    if (!sidebarOpen && isSelectingDates) {
      dispatch(resetSelectedDates())
      dispatch(setIsSelectingDates(false))
    }
  }, [dispatch, isSelectingDates, sidebarOpen])

  return (
    <main>
      <Alert />
      <div className='flex h-screen w-full flex-col bg-white text-slate-800'>
        <div className='z-10'>
          <NavBar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        </div>
        <div className='border-box z-0 flex h-[90vh] w-full flex-row'>
          <div
            className={`${
              sidebarOpen ? 'w-1/5 translate-x-0 border-r border-slate-200 pr-2' : 'w-0 -translate-x-full'
            } overflow-visible transition-all`}
          >
            {sidebarOpen && <SideBar session={session} />}
          </div>
          <div className={`${sidebarOpen ? 'w-4/5' : 'w-full'} flex flex-col transition-all`}>
            <MainCalendar />
          </div>
        </div>
      </div>
    </main>
  )
}

// schema for query params
const querySchema = z.object({
  interval: z.nativeEnum(CalendarInterval).optional(),
  date: z
    .string()
    .refine((date) => dayjs(date).isValid())
    .optional()
})

// get data from database on server side
export const getServerSideProps: GetServerSideProps = wrapper.getServerSideProps((store) => {
  return async ({ req, res, query }) => {
    // check if query params are valid
    const parsedQuery = querySchema.safeParse(query)
    // if query params are invalid, redirect to home page
    if (!parsedQuery.success) {
      return {
        redirect: {
          destination: '/',
          permanent: false
        }
      }
    }
    // if query params are valid, set interval and date in redux store
    const { interval, date } = parsedQuery.data
    if (date) {
      store.dispatch(setDate(dayjs(date)))
    }
    if (interval) {
      store.dispatch(setInterval(interval))
    }

    // get cookies
    const cookies = getCookies({ req, res })

    // if sidebar cookie is undefined, set it to true
    let sidebarOpenInitial = true
    if (cookies['yojana.sidebar-open'] === undefined) {
      setCookieMaxAge('yojana.sidebar-open', true, { req, res })
    } else {
      // if sidebar cookie is defined, set sidebarOpenInitial to the value of the cookie
      sidebarOpenInitial = cookies['yojana.sidebar-open'] === 'true'
    }

    const { yearShowGrid, yearOverflow } = defaultPreferences

    // set cookie for yearShowGrid
    const yearShowGridCookie = cookies[yearShowGrid.cookieName]
    if (yearShowGridCookie === undefined) {
      setCookieMaxAge(yearShowGrid.cookieName, yearShowGrid.value, { req, res })
    } else {
      // if the yearShowGrid cookie is defined, set yearShowGrid to true or false based on the value of the cookie
      store.dispatch(setYearShowGrid(yearShowGridCookie === 'true'))
    }

    // set cookie for yearOverflow
    const yearOverflowCookie = cookies[yearOverflow.cookieName]
    if (yearOverflowCookie === undefined || (yearOverflowCookie !== 'expand' && yearOverflowCookie !== 'scroll')) {
      // if yearOverflow cookie is undefined or invalid, set it to the default value
      setCookieMaxAge(yearOverflow.cookieName, yearOverflow.value, { req, res })
    } else {
      // if yearOverflow cookie is defined and valid, set yearOverflow to the value of the cookie
      store.dispatch(setYearOverflow(yearOverflowCookie))
    }

    // current session
    const session = await getServerSession(req, res, authOptions)

    // if date query param exists, get the year for that year, otherwise get the current year
    const year = date ? dayjs(date).year() : dayjs().year()

    const [categoriesWithoutEntries, categoriesData] = await Promise.all([
      // make query to database to get all categories without entries
      getCategoriesWithoutEntries(session?.user.id),
      // make query to database to get categories with entries only if the category has en entry in the current year
      // this reduces the amount of date being sent to the client on initial render
      getCategories(session?.user.id, year)
    ])
    // add entries to each category in categoriesWithoutEntries
    const categories: CategoryFull[] = []
    categoriesWithoutEntries.forEach((categoryWithoutEntries) => {
      const categoryData = categoriesData.find((cat) => cat.id === categoryWithoutEntries.id)
      categories.push({ ...categoryWithoutEntries, entries: categoryData ? categoryData.entries : [] })
    })
    // add show property to each category based on cookie value
    const appDate = categories.map((category) => {
      let show = true
      const key = `yojana.show-category-${category.id}`
      if (cookies[key] === undefined) {
        // if cookie is undefined, set it to true
        setCookieMaxAge(key, 'true', { req, res })
      } else {
        // if cookie is defined, set show to the value of the cookie
        show = cookies[key] === 'true'
      }
      return { ...category, show: show }
    })

    store.dispatch(setAppData(appDate))
    return {
      props: {
        sidebarOpenInitial,
        session
      }
    }
  }
})

export default Calendar
