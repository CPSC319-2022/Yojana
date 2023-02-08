import { NavBar } from '@/components/navBar'
import { MainCalendar } from '@/components/mainCalendar'
import { SideBar } from '@/components/sideBar/'
import { useEffect, useState } from 'react'
import { Category } from '@/utils/types'

const Calendar = () => {
  const [categories, setCategories] = useState<Category[]>([])
  const getCategories = async () => {
    const res = await fetch('/api/cats')
    const data = await res.json()
    console.log(data)
    return data
  }

  useEffect(() => {
    getCategories().then((data) => {
      setCategories(data)
    })
  }, [])

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

export default Calendar
