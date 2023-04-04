import { Alert } from '@/components/common'
import { MainCalendar, Month } from '@/components/mainCalendar'
import { NavBar } from '@/components/navBar'
import { SideBar } from '@/components/sideBar/'
import { CalendarInterval } from '@/constants/enums'
import { getCategories } from '@/prisma/queries'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { getIsMobile, setAppData, setIsMobile } from '@/redux/reducers/AppDataReducer'
import { getIsSelectingDates, resetSelectedDates, setIsSelectingDates } from '@/redux/reducers/DateSelectorReducer'
import { setDate, setInterval } from '@/redux/reducers/MainCalendarReducer'
import { wrapper } from '@/redux/store'
import { getCookies } from 'cookies-next'
import dayjs from 'dayjs'
import { GetServerSideProps } from 'next'
import { getServerSession, Session } from 'next-auth'
import { useCallback, useEffect, useMemo } from 'react'
import { authOptions } from './api/auth/[...nextauth]'
import { setCookieMaxAge } from '@/utils/cookies'
import {
  defaultPreferences,
  getPreferences,
  setIsSidebarOpen,
  setMonthCategoryAppearance,
  setShowWeekNumbers,
  setYearOverflow,
  setYearShowGrid
} from '@/redux/reducers/PreferencesReducer'
import { preprocessEntries } from '@/utils/preprocessEntries'
import { Device } from '@/components/Device'
import { isMobile } from 'react-device-detect'

/**
 * session: The user's session data.
 */
interface CalendarProps {
  session: Session
}

const SMALL_SCREEN_PX = 640 // same number as tailwind's docs

/**
 * Calendar is a functional component that serves as the main layout for the calendar view. It is responsible for rendering the navigation bar, sidebar, main calendar view, and alert components. The component also handles the interaction between the sidebar and the date selector.
 * Key functionalities:
 * Dispatching actions to update the Redux store based on query parameters, cookies, and server data.
 * Resetting the selected dates when the sidebar is closed during date selection mode.
 * Rendering the Alert, NavBar, SideBar, and MainCalendar components.
 *
 * @param CalendarProps
 * @returns {JSX.Element} The rendered Calendar component.
 */
const Calendar = ({ session }: CalendarProps) => {
  const dispatch = useAppDispatch()
  const sidebarOpen = useAppSelector(getPreferences).sidebarOpen.value
  const isSelectingDates = useAppSelector((state) => getIsSelectingDates(state))
  const isMobileView = useAppSelector(getIsMobile)

  const setMobile = useCallback(() => {
    if (typeof window !== 'undefined') dispatch(setIsMobile(isMobile || window.innerWidth < SMALL_SCREEN_PX))
  }, [dispatch])

  useEffect(() => {
    setMobile()

    window.addEventListener('resize', setMobile)
    return () => {
      window.removeEventListener('resize', setMobile)
    }
  }, [setMobile])

  useEffect(() => {
    if (isMobileView) {
      dispatch(setInterval(CalendarInterval.MONTH))
      dispatch(setIsSidebarOpen(false))
    }
  }, [dispatch, isMobileView])

  const mobileContent = useMemo(() => {
    return (
      <div className='h-full w-full'>
        <div className='z-10 h-[10vh]'>
          <NavBar session={session} />
        </div>
        <div className='border-box z-0 h-[90vh] w-full'>
          <div
            className={`absolute z-10 h-[90vh] overflow-hidden bg-white transition-all
                ${sidebarOpen ? 'w-[80vw] translate-x-0 border-r border-slate-200' : 'w-0 -translate-x-full'} `}
          >
            {sidebarOpen && <SideBar session={session} />}
          </div>
          {sidebarOpen && (
            <div
              className={`absolute z-[5] h-[90vh] w-full bg-slate-800 opacity-30`}
              onClick={() => dispatch(setIsSidebarOpen(false))}
            />
          )}
          <div className={`h-full w-full`}>
            <Month monthOffset={0} className={'h-full'} />
          </div>
        </div>
      </div>
    )
  }, [dispatch, session, sidebarOpen])

  const desktopContent = useMemo(() => {
    return (
      <>
        <Alert />
        <div className='flex h-screen w-full flex-col bg-white text-slate-800'>
          <div className='z-10'>
            <NavBar session={session} />
          </div>
          <div className='border-box z-0 flex h-[90vh] w-full flex-row'>
            <div
              className={`${
                sidebarOpen
                  ? 'inline-block w-1/5 translate-x-0 overflow-x-hidden border-r border-slate-200'
                  : 'w-0 -translate-x-full'
              } overflow-visible transition-all`}
            >
              {sidebarOpen && <SideBar session={session} />}
            </div>
            <div className={`${sidebarOpen ? 'w-4/5' : 'w-full'} flex flex-grow flex-col transition-all`}>
              <MainCalendar />
            </div>
          </div>
        </div>
      </>
    )
  }, [session, sidebarOpen])

  // reset selected dates when sidebar is closed while in date selection mode
  useEffect(() => {
    if (!sidebarOpen && isSelectingDates) {
      dispatch(resetSelectedDates())
      dispatch(setIsSelectingDates(false))
    }
  }, [dispatch, isSelectingDates, sidebarOpen])

  return (
    <main className={'overflow-hidden'}>
      <Device>
        {({ isMobile }) => {
          if (isMobile || isMobileView) return mobileContent
          return desktopContent
        }}
      </Device>
    </main>
  )
}

// get data from database on server side
export const getServerSideProps: GetServerSideProps = wrapper.getServerSideProps((store) => {
  return async ({ req, res, query }) => {
    const { interval, date } = query
    // check if date query param is valid
    if (date && typeof date === 'string' && dayjs(date).isValid()) {
      store.dispatch(setDate(dayjs(date)))
    }
    // check if interval query param is valid
    if (interval && Object.values(CalendarInterval).includes(interval as CalendarInterval)) {
      store.dispatch(setInterval(interval as CalendarInterval))
    }

    // get cookies
    const cookies = getCookies({ req, res })

    const { yearShowGrid, yearOverflow, monthCategoryAppearance, sidebarOpen, showWeekNumbers } = defaultPreferences

    // if sidebar cookie is undefined, set it to true
    const sidebarOpenInitial = cookies[sidebarOpen.cookieName]
    if (sidebarOpenInitial === undefined) {
      setCookieMaxAge(sidebarOpen.cookieName, true, { req, res })
    } else {
      // if sidebar cookie is defined, set sidebarOpenInitial to the value of the cookie
      store.dispatch(setIsSidebarOpen(sidebarOpenInitial === 'true'))
    }

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
    if (yearOverflowCookie === undefined || (yearOverflowCookie !== 'wrap' && yearOverflowCookie !== 'scroll')) {
      // if yearOverflow cookie is undefined or invalid, set it to the default value
      setCookieMaxAge(yearOverflow.cookieName, yearOverflow.value, { req, res })
    } else {
      // if yearOverflow cookie is defined and valid, set yearOverflow to the value of the cookie
      store.dispatch(setYearOverflow(yearOverflowCookie))
    }

    // set cookie for monthCategoryAppearance
    const monthCategoryAppearanceCookie = cookies[monthCategoryAppearance.cookieName]
    if (monthCategoryAppearanceCookie === undefined) {
      setCookieMaxAge(monthCategoryAppearance.cookieName, monthCategoryAppearance.value, { req, res })
    } else {
      // if the monthCategoryAppearance cookie is defined, set monthCategoryAppearance to icons or banners based on the value of the cookie
      store.dispatch(setMonthCategoryAppearance(monthCategoryAppearanceCookie === 'icons' ? 'icons' : 'banners'))
    }

    // set cookie for setShowWeekNumbers
    const setShowWeekNumbersCookie = cookies[showWeekNumbers.cookieName]
    if (setShowWeekNumbersCookie === undefined) {
      setCookieMaxAge(showWeekNumbers.cookieName, showWeekNumbers.value, { req, res })
    } else {
      // if the setShowWeekNumbers cookie is defined, set setShowWeekNumbers to true or false based on the value of the cookie
      store.dispatch(setShowWeekNumbers(setShowWeekNumbersCookie === 'true'))
    }

    // current session
    const session = await getServerSession(req, res, authOptions)

    // make query to database to get categories
    const categories = await getCategories(session?.user.id)
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
      category.entries = preprocessEntries(category.entries)
      return { ...category, show: show }
    })

    store.dispatch(setAppData(appDate))
    return {
      props: {
        session
      }
    }
  }
})

export default Calendar
