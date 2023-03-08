import { Alert } from '@/components/common'
import { MainCalendar } from '@/components/mainCalendar'
import { NavBar } from '@/components/navBar'
import { SideBar } from '@/components/sideBar/'
import { CalendarInterval } from '@/constants/enums'
import { getCategories } from '@/prisma/queries'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { setAppData } from '@/redux/reducers/AppDataReducer'
import { getIsSelectingDates, resetSelectedDates, setIsSelectingDates } from '@/redux/reducers/DateSelectorReducer'
import { setDate, setInterval, setGridPreferences, setYearPreferences } from '@/redux/reducers/MainCalendarReducer'
import { wrapper } from '@/redux/store'
import { getCookies, setCookie } from 'cookies-next'
import dayjs from 'dayjs'
import { GetServerSideProps } from 'next'
import { getServerSession, Session } from 'next-auth'
import { useEffect, useState } from 'react'
import { authOptions } from './api/auth/[...nextauth]'

interface CalendarProps {
  sidebarOpenInitial: boolean
  session: Session
  yearViewPref: boolean
  gridViewPref: boolean
}

const Calendar = ({ sidebarOpenInitial, session, yearViewPref, gridViewPref }: CalendarProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(sidebarOpenInitial)
  const [prefScroll, setPrefScroll] = useState(yearViewPref)
  const [prefGrid, setPrefGrid] = useState(gridViewPref)
  const dispatch = useAppDispatch()
  const isSelectingDates = useAppSelector((state) => getIsSelectingDates(state))

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
          <NavBar
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            prefScroll={prefScroll}
            setPrefScroll={setPrefScroll}
            prefGrid={prefGrid}
            setPrefGrid={setPrefGrid}
          />
        </div>
        <div className='border-box z-0 flex h-[90vh] w-full flex-row'>
          <div
            className={`${
              sidebarOpen ? 'w-1/5 translate-x-0 pr-2' : 'w-0 -translate-x-full'
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

    // if sidebar cookie is undefined, set it to true
    let sidebarOpenInitial = true
    if (cookies['yojana.sidebar-open'] === undefined) {
      setCookie('yojana.sidebar-open', true, { req, res })
    } else {
      // if sidebar cookie is defined, set sidebarOpenInitial to the value of the cookie
      sidebarOpenInitial = cookies['yojana.sidebar-open'] === 'true'
    }

    // set cookie for yearViewPref
    let yearViewPref = true
    if (cookies['yojana.yearViewPref'] === undefined) {
      setCookie('yojana.yearViewPref', true, { req, res })
    } else {
      // if yearViewPref cookie is defined, set yearViewPref to the value of the cookie
      yearViewPref = cookies['yojana.yearViewPref'] === 'true'
    }
    store.dispatch(setYearPreferences(yearViewPref))

    // set cookie for gridViewPref
    let gridViewPref = true
    if (cookies['yojana.gridViewPref'] === undefined) {
      setCookie('yojana.gridViewPref', true, { req, res })
    } else {
      // if gridViewPref cookie is defined, set gridViewPref to the value of the cookie
      gridViewPref = cookies['yojana.gridViewPref'] === 'true'
    }
    store.dispatch(setGridPreferences(gridViewPref))

    // make query to database to get categories
    const categories = await getCategories()
    // add show property to each category based on cookie value
    const appDate = categories.map((category) => {
      let show = true
      const key = `yojana.show-category-${category.id}`
      if (cookies[key] === undefined) {
        // if cookie is undefined, set it to true
        setCookie(key, 'true', { req, res })
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
        yearViewPref,
        gridViewPref,
        session: await getServerSession(req, res, authOptions)
      }
    }
  }
})

export default Calendar
