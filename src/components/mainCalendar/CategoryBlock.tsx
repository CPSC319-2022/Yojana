import { getTextColor } from '@/utils/color'
import React from 'react'
import { Icon, IconName } from '@/components/common'

/**
 * color: The background color of the CategoryBlock component.
 * label: The text label to be displayed in the CategoryBlock.
 * icon: The name of the icon to be displayed in the CategoryBlock.
 * className: Optional styling for the CategoryBlock.
 */
interface CategoryBlockProps {
  color: string
  label: string
  icon: IconName
  className?: string
}

/**
 * CategoryBlock displays a block component with an icon, label, and background color.
 * The text color is determined based on the background color to ensure readability.
 * The component utilizes the getTextColor utility function to set appropriate text color.
 *
 * @param CategoryBlockProps
 * @returns {JSX.Element}
 */
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
