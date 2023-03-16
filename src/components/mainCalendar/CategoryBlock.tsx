import { getTextColor } from '@/utils/color'
import React from 'react'
import { Icon, IconName } from '@/components/common'

interface CategoryBlockProps {
  color: string
  label: string
  icon: IconName
  className?: string
}

export const CategoryBlock = ({ color, label, icon, className }: CategoryBlockProps) => {
  return (
    <>
      <style jsx>{`
        .event-block {
          background-color: ${color};
        }
      `}</style>
      <div
        aria-label={label}
        className={`event-block mx-1 mt-1 overflow-x-hidden whitespace-nowrap rounded-md px-1.5 
          ${getTextColor(color)} 
          ${className}`}
      >
        <Icon iconName={icon} className='mb-0.5 mr-1 inline' />
        {label}
      </div>
    </>
  )
}
