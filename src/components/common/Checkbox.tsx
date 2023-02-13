import React, { ReactElement } from 'react'

interface CheckboxProps {
  label: string
  id: string
  checkboxClassName?: string
  wrapperClassName?: string
  color: string
}

export const Checkbox = ({ color, id, checkboxClassName, label, wrapperClassName }: CheckboxProps): ReactElement => {
  if (color === '#f59e0b') {
    color = 'accent-orange-400'
  } else if (color === '#10b981') {
    color = 'accent-green-400'
  } else if (color === '#0ea5e9') {
    color = 'accent-blue-400'
  } else if (color === '#ef4444') {
    color = 'accent-red-400'
  } else if (color === '#0f172a') {
    color = 'accent-gray-400'
  } else if (color === '#8b5cf6') {
    color = 'accent-purple-400'
  }

  return (
    <div className={wrapperClassName}>
      <input
        type='checkbox'
        id={id}
        className={`${color} ${checkboxClassName} relative bottom-px align-middle`}
        defaultChecked
      />
      <label className='ml-2' htmlFor={id}>
        {label}
      </label>
    </div>
  )
}
