import { NavBar } from '@/components/navBar'
import { MainCalendar } from '@/components/mainCalendar'
import { SideBar } from '@/components/sideBar/'
import { AppData } from '@/types/prisma'
import { getCategories } from '@/prisma/queries'
import { setAppData } from '@/redux/reducers/AppDataReducer'
import { useAppDispatch } from '@/redux/hooks'
import { useState } from 'react'
import { Transition } from '@headlessui/react'
import { getCookies, setCookie } from 'cookies-next'
import { GetServerSideProps } from 'next'

const Calendar = ({ data }: { data: AppData }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const dispatch = useAppDispatch()
  dispatch(setAppData(data))

  return (
    <main>
      <div className='flex h-screen w-full flex-col bg-white text-slate-800'>
        <NavBar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <div className='border-box flex h-[88vh] w-full flex-row'>
          <Transition
            show={sidebarOpen}
            enter='transition ease-out duration-200 transform'
            enterFrom='-translate-x-full'
            enterTo='translate-x-0'
            leave='transition ease-in duration-200 transform'
            leaveFrom='translate-x-0'
            leaveTo='-translate-x-full'
          >
            <div className='pr-2'>
              <SideBar />
            </div>
          </Transition>
          <div className='flex w-full flex-col'>
            <MainCalendar />
          </div>
        </div>
      </div>
    </main>
  )
}

// get data from database on server side
export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  // get cookies
  const cookies = getCookies({ req, res })

  // make query to database to get categories
  let categories = await getCategories()
  // add show property to each category based on cookie value
  categories = categories.map((category) => {
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
  return { props: { data: JSON.parse(JSON.stringify(categories)) } }
  // the reason why we do JSON.parse(JSON.stringify(categories)) is because we need to convert the prisma object to a normal object
  // https://github.com/vercel/next.js/issues/11993
}

export default Calendar
