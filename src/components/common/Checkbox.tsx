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
      <style jsx>{`
        input[type='checkbox'] {
          accent-color: ${color};
        }
      `}</style>
      <input
        type='checkbox'
        id={id}
        className={`${checkboxClassName} relative bottom-px align-middle`}
        defaultChecked
      />
      <label className='ml-2' htmlFor={id}>
        {label}
      </label>
    </div>
  )
}
