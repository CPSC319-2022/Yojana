import React from 'react'
import { Icon, IconName } from '@/components/common/Icon'

interface CheckboxProps {
  label: string
  id: string
  color: string
  defaultChecked?: boolean
  checkboxClassName?: string
  wrapperClassName?: string
  icon: IconName
  onChange?: () => void
}

export const Checkbox = ({
  color,
  id,
  checkboxClassName,
  label,
  defaultChecked = false,
  icon,
  onChange
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
        defaultChecked={defaultChecked}
        onChange={onChange}
      />
      <label className='ml-2' htmlFor={id}>
        <span className={'colored pr-1 font-bold'}>
          <Icon iconName={icon} color={color} className='inline' />
        </span>
        {label}
      </label>
    </div>
  )
}
