import React, { ReactElement } from 'react'

interface CheckboxProps {
  label: string
  id: string
  className?: string
  color?: string
}

/*
export const Checkbox = (props: CheckboxProps): ReactElement => {
  return (
    <div>
      <input type='checkbox' id={props.id} />
      <label className='ml-2' htmlFor={props.id}>
        {props.label}
      </label>
    </div>
  )
}
 */
export const Checkbox = (props: CheckboxProps): ReactElement => {
  return (
    <div>
      <input type='checkbox' id={props.id} style={{ color: 'yellow' }} />
      <label className='ml-2' htmlFor={props.id}>
        {props.label}
      </label>
    </div>
  )
}
