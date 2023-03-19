import { Switch } from '@headlessui/react'
import { Icon, IconName } from '@/components/common'
import { Tooltip } from '@/components/common/Tooltip'

interface ToggleProps {
  textToToggle: string[]
  name: string
  preference: boolean
  onChange: () => void
  disabled?: boolean
  className?: string
  tooltipIcon?: IconName
  tooltipPosition?: 'top' | 'bottom' | 'left' | 'right'
  tooltipText?: string
}

export const Toggle = ({
  textToToggle,
  name,
  className = 'w-full',
  preference,
  onChange,
  disabled = false,
  tooltipIcon,
  tooltipPosition = 'top',
  tooltipText = ''
}: ToggleProps) => {
  return (
    <div className='space-between mt-2 inline-flex'>
      <div className={className}>
        {preference ? textToToggle[0] : textToToggle[1]}
        {tooltipIcon && tooltipText && (
          <Tooltip text={tooltipText} position={tooltipPosition}>
            <Icon iconName={tooltipIcon} className='mb-0.5 inline' />
          </Tooltip>
        )}
      </div>
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
        relative inline-flex h-[20px] w-[40px] shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none`}
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
