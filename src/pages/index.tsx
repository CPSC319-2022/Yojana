import styles from './index.module.scss'
import { NavBar } from '@/components/navBar'
import { Button } from 'react-bootstrap'
import { CategoriesMenu } from '@/components/categoriesMenu'
import { MiniCalendar } from '@/components/miniCalendar'
import { MainCalendar } from '@/components/mainCalendar'

const Calendar = () => {
  return (
    <main>
      <div className={styles.home}>
        <NavBar />
        <div className='row g-0'>
          <div className='col-md-3'>
            <Button>Create</Button>
            <MiniCalendar />
            <CategoriesMenu />
          </div>
          <div className='col-md-9'>
            <MainCalendar />
          </div>
        </div>
      </div>
    </main>
  )
}

export default Calendar
