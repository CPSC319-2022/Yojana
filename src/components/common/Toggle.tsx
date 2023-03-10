import { useAppDispatch } from '@/redux/hooks'
import { setGridPreferences, setYearPreferences } from '@/redux/reducers/MainCalendarReducer'
import { Switch } from '@headlessui/react'
import { setCookie } from 'cookies-next'

interface ToggleProps {
  textToToggle: string[]
  cookieName: string
  className?: string
  preference: boolean
  setPreference: (value: boolean) => void
}
export const Toggle = ({
  textToToggle,
  cookieName,
  className = 'w-[12vw]',
  preference,
  setPreference
}: ToggleProps) => {
  const dispatch = useAppDispatch()
  return (
    <div className='space-between mt-2 inline-flex'>
      <div className={className}>{preference ? textToToggle[0] : textToToggle[1]}</div>
      <Switch
        checked={preference}
        name={cookieName}
        onChange={() => {
          setPreference(!preference)
          setCookie(cookieName, !preference)
          cookieName === 'yojana.yearViewPref'
            ? dispatch(setYearPreferences(!preference))
            : dispatch(setGridPreferences(!preference))
        }}
        className={`${preference ? 'bg-emerald-600' : 'bg-emerald-400'}
        relative inline-flex h-[20px] w-[40px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75`}
      >
        <span className='sr-only'>Use setting</span>
        <span
          aria-hidden='true'
          className={`${preference ? 'translate-x-5' : 'translate-x-0'}
          pointer-events-none inline-block h-[16px] w-[16px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
        />
      </Switch>
    </div>
  )
}
