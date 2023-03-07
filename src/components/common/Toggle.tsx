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
  className = 'w-[12vw] text-lg',
  preference,
  setPreference
}: ToggleProps) => {
  return (
    <div className='space-between mt-2 inline-flex p-3'>
      <div className={className}>{preference ? textToToggle[0] : textToToggle[1]}</div>
      <Switch
        checked={preference}
        onChange={() => {
          setPreference(!preference)
          setCookie(cookieName, !preference)
        }}
        className={`${preference ? 'bg-emerald-700' : 'bg-emerald-400'}
        relative inline-flex h-[38px] w-[74px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
      >
        <span className='sr-only'>Use setting</span>
        <span
          aria-hidden='true'
          className={`${preference ? 'translate-x-9' : 'translate-x-0'}
          pointer-events-none inline-block h-[34px] w-[34px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
        />
      </Switch>
    </div>
  )
}
