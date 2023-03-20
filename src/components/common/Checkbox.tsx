import React from 'react'
import { Icon, IconName } from '@/components/common/Icon'

interface CheckboxProps {
  label: string
  id: string
  color: string
  checked?: boolean
  checkboxClassName?: string
  wrapperClassName?: string
  icon: IconName
  onChange?: () => void
  iconClassName?: string
}

export const Checkbox = ({
  color,
  id,
  checkboxClassName,
  label,
  checked,
  icon,
  onChange,
  iconClassName
}: CheckboxProps) => {
  return (
    <div className={`items-center truncate`}>
      <style jsx>{`
        input[type='checkbox'] {
          accent-color: ${color};
        }
        span {
          color: ${color};
        }
      `}</style>
      <input
        type='checkbox'
        id={id}
        className={`${checkboxClassName} relative bottom-px align-middle`}
        checked={checked}
        onChange={onChange}
      />
      <label className='ml-2 cursor-pointer' htmlFor={id}>
        <span className={'colored pr-1 font-bold'}>
          <Icon iconName={icon} color={color} className={`inline ${iconClassName}`} />
        </span>
        {label}
      </label>
    </div>
  )
}
