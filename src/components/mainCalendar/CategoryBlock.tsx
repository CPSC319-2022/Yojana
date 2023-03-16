import { useAppSelector } from '@/redux/hooks'
import { isMonthInterval } from '@/redux/reducers/MainCalendarReducer'
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
  const monthView = useAppSelector(isMonthInterval)

  return (
    <>
      <style jsx>{`
        .event-block {
          background-color: ${color};
        }
      `}</style>
      <div
        aria-label={label}
        className={`event-block mx-1 mt-1 min-h-[1vh] overflow-x-hidden whitespace-nowrap rounded-md px-1.5 
          ${getTextColor(color)} 
          ${className}`}
      >
        {monthView && (
          <>
            <Icon iconName={icon} className='mb-0.5 mr-1 inline' />
            {label}
          </>
        )}
      </div>
    </>
  )
}
