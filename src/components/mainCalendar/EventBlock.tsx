import React, { ReactElement } from 'react'
import { getTextColor } from '@/utils/color'

interface EventBlockProps {
  color: string
  label: string
}

export const EventBlock = (props: EventBlockProps): ReactElement => {
  return <div className={`bg-[${props.color}] mt-1 ${getTextColor(props.color)}`}>{props.label}</div>
}
