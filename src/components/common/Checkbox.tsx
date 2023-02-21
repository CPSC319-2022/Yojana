import React from 'react'

interface CheckboxProps {
  label: string
  id: string
  color: string
  defaultChecked?: boolean
  checkboxClassName?: string
  wrapperClassName?: string
  onChange?: () => void
}

export const Checkbox = ({ color, id, checkboxClassName, label, defaultChecked = false, onChange }: CheckboxProps) => {
  return (
    <div className={`items-center truncate`}>
      <style jsx>{`
        input[type='checkbox'] {
          accent-color: ${color};
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
        {label}
      </label>
    </div>
  )
}
