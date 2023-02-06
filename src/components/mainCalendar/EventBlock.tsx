import React, { ReactElement } from 'react'

interface EventBlockProps {
  color: string
  label: string
}

export const EventBlock = (props: EventBlockProps): ReactElement => {
  return <div className={`bg-[#${props.color}] mt-1`}>{props.label}</div>
}
