import React from 'react'

interface CheckboxProps {
  label: string
  id: string
  checkboxClassName?: string
  wrapperClassName?: string
  color: string
}

export const Checkbox = ({ color, id, checkboxClassName, label, wrapperClassName }: CheckboxProps) => {
  return (
    <div className={wrapperClassName}>
      <input
        type='checkbox'
        id={id}
        className={`${color} ${checkboxClassName} relative bottom-px align-middle`}
        style={{ accentColor: color }}
        defaultChecked
      />
      <label className='ml-2' htmlFor={id}>
        {label}
      </label>
    </div>
  )
}
