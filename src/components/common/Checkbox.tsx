import React, { ReactElement } from 'react'

interface CheckboxProps {
  color: string
  label: string
  id: string
  className?: string
}

export const Checkbox = (props: CheckboxProps): ReactElement => {
  return (
    <div>
      <input type='checkbox' id={props.id} />
      <label className={props.color} htmlFor={props.id}>
        {props.label}
      </label>
    </div>
  )
}
