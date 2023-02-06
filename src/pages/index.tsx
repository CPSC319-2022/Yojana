import { NavBar } from '@/components/navBar'
import { CategoriesMenu } from '@/components/categoriesMenu'
import { MainCalendar } from '@/components/mainCalendar'
import { SideBar } from '@/components/sideBar/SideBar'

const Calendar = () => {
  return (
    <main>
      <div className='flex h-screen w-full flex-col bg-white text-black'>
        <NavBar className='flex h-12 w-full flex-row' />
        <div className='flex w-full grow flex-row'>
          <div className='w-1/5'>
            <SideBar className='pl-2 pr-2' />
          </div>
          <div className='flex w-4/5 flex-col'>
            <MainCalendar />
          </div>
        </div>
      </div>
    </main>
  )
}

export default Calendar
