import { NavBar } from '@/components/navBar'
import { MainCalendar } from '@/components/mainCalendar'
import { SideBar } from '@/components/sideBar/'
import { getCategories } from '@/prisma/queries'
import { setAppData } from '@/redux/reducers/AppDataReducer'
import { useState } from 'react'
import { getCookies, setCookie } from 'cookies-next'
import { GetServerSideProps } from 'next'
import { Alert } from '@/components/common'
import { wrapper } from '@/redux/store'
import { setDate, setInterval } from '@/redux/reducers/MainCalendarReducer'
import dayjs from 'dayjs'
import { CalendarInterval } from '@/constants/enums'
import { AppData } from '@/types/prisma'
import { useAppDispatch } from '@/redux/hooks'

interface CalendarProps {
  data: AppData
  sidebarOpenInitial: boolean
}

const Calendar = ({ sidebarOpenInitial, data }: CalendarProps) => {
  const dispatch = useAppDispatch()
  dispatch(setAppData(data))
  const [sidebarOpen, setSidebarOpen] = useState(sidebarOpenInitial)

  return (
    <main>
      <Alert />
      <div className='flex h-screen w-full flex-col bg-white text-slate-800'>
        <NavBar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <div className='border-box flex h-[90vh] w-full flex-row'>
          <div
            className={`${
              sidebarOpen ? 'w-1/5 translate-x-0 pr-2' : 'w-0 -translate-x-full'
            } overflow-visible transition-all`}
          >
            {sidebarOpen && <SideBar />}
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
    const { interval, year, month, day } = query
    try {
      if (year && month && day) {
        store.dispatch(setDate(dayjs(new Date(Number(year), Number(month), Number(day)))))
      }
    } catch (e) {
      // if date query params are invalid, set date to today
      store.dispatch(setDate(dayjs()))
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

    // pass data to the page via props
    return { props: { data: JSON.parse(JSON.stringify(appDate)), sidebarOpenInitial } }
    // the reason why we do JSON.parse(JSON.stringify(categories)) is because we need to convert the prisma object to a normal object
    // https://github.com/vercel/next.js/issues/11993
  }
})

export default Calendar
