import { NavBar } from '@/components/navBar'
import { MainCalendar } from '@/components/mainCalendar'
import { SideBar } from '@/components/sideBar/'
import { useState } from 'react'
import { Category } from '@/types/Category'
import { getCategories } from '@/prisma/queries'

const Calendar = ({ data }: { data: Category[] }) => {
  const [categories, setCategories] = useState<Category[]>(data)

  return (
    <main>
      <div className='flex h-screen w-full flex-col bg-white text-black'>
        <NavBar className='flex h-12 w-full flex-row' />
        <div className='flex w-full grow flex-row'>
          <div className='w-1/5 pl-2 pr-2'>
            <SideBar categories={categories} />
          </div>
          <div className='flex w-4/5 flex-col'>
            <MainCalendar categories={categories} />
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
