import React, { ReactElement } from 'react'

interface CheckboxProps {
  label: string
  id: string
  className?: string
  color: string
}

export const Checkbox = (props: CheckboxProps): ReactElement => {
  let color
  if (props.color === '#f59e0b') {
    color = 'accent-orange-400'
  } else if (props.color === '#10b981') {
    color = 'accent-green-400'
  } else if (props.color === '#0ea5e9') {
    color = 'accent-blue-400'
  } else if (props.color === '#ef4444') {
    color = 'accent-red-400'
  } else if (props.color === '#0f172a') {
    color = 'accent-gray-400'
  } else if (props.color === '#8b5cf6') {
    color = 'accent-purple-400'
  }

  return (
    <div>
      <label>
        <input type='checkbox' id={props.id} className={color} defaultChecked />
      </label>
      <label className='ml-2' htmlFor={props.id}>
        {props.label}
      </label>
    </div>
  )
}
