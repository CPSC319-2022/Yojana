import { Switch } from '@headlessui/react'

interface ToggleProps {
  textToToggle: string[]
  name: string
  preference: boolean
  onChange: () => void
  className?: string
}
export const Toggle = ({ textToToggle, name, className = 'w-full', preference, onChange }: ToggleProps) => {
  return (
    <div className='space-between mt-2 inline-flex'>
      <div className={className}>{preference ? textToToggle[0] : textToToggle[1]}</div>
      <Switch
        checked={preference}
        name={name}
        onChange={onChange}
        className={`${preference ? 'bg-emerald-500' : 'bg-emerald-300'}
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
