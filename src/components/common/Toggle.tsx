import { Switch } from '@headlessui/react'

interface ToggleProps {
  textToToggle: string[]
  name: string
  preference: boolean
  onChange: () => void
  disabled?: boolean
  className?: string
}
export const Toggle = ({
  textToToggle,
  name,
  className = 'w-full',
  preference,
  onChange,
  disabled = false
}: ToggleProps) => {
  return (
    <div className='space-between mt-2 inline-flex'>
      <div className={className}>{preference ? textToToggle[0] : textToToggle[1]}</div>
      <Switch
        checked={preference}
        name={name}
        onChange={onChange}
        className={`${
          disabled
            ? 'cursor-auto bg-slate-200'
            : preference
            ? 'cursor-pointer bg-emerald-500'
            : 'cursor-pointer bg-emerald-300'
        }
        relative inline-flex h-[20px] w-[40px] shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75`}
        disabled={disabled}
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
