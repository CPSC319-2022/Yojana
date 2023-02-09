import { NavBar } from '@/components/navBar'
import { MainCalendar } from '@/components/mainCalendar'
import { SideBar } from '@/components/sideBar/'
import { AppData } from '@/types/AppData'
import { getCategories } from '@/prisma/queries'
import { setAppData } from '@/redux/reducers/AppDataReducer'
import { useAppDispatch } from '@/redux/hooks'

const Calendar = ({ data }: { data: AppData[] }) => {
  const dispatch = useAppDispatch()
  dispatch(setAppData(data))

  return (
    <main>
      <div className='flex h-screen w-full flex-col bg-white text-black'>
        <NavBar className='navbar box-border flex h-[12vh] w-full flex-row' />
        <div className='border-box flex h-[88vh] w-full flex-row'>
          <div className='w-1/5 pl-2 pr-2'>
            <SideBar />
          </div>
          <div className='flex w-4/5 flex-col overflow-y-auto'>
            <MainCalendar />
          </div>
        </div>
      </div>
    </main>
  )
}

// get data from database on server side
export async function getServerSideProps() {
  // make query to database to get categories
  const categories = await getCategories()

  // pass data to the page via props
  return { props: { data: JSON.parse(JSON.stringify(categories)) } }
  // the reason why we do JSON.parse(JSON.stringify(categories)) is because we need to convert the prisma object to a normal object
  // https://github.com/vercel/next.js/issues/11993
}

export default Calendar
