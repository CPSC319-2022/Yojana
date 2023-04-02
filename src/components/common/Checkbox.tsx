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

/**
 * * Checkbox component that allows users to select multiple options from a list.
 * @param color - Color of checkbox item.
 * @param id - ID of checkbox.
 * @param checkboxClassName - Additional CSS classes to apply to the checkbox element.
 * @param label - Label for checkbox.
 * @param checked - States whether checkbox is checked or not.
 * @param icon - Icon to display next to checkbox.
 * @param onChange - Function to be called when the checkbox is checked/unchecked.
 * @param iconClassName - Additional CSS classes to apply to the icon element.
 * @constructor
 */
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
