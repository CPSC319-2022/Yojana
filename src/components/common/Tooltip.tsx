import React, { useState } from 'react'
// This file defines a React component that displays a tooltip on hover of its child element.
type Props = {
  text: string
  position?: 'top' | 'bottom' | 'left' | 'right'
  children: React.ReactNode
  boundingClassName?: string
  popoverClassName?: string
}
/**
 * * A component that displays a tooltip on hover of its child element.
 * @param text - The text content to be displayed in the tooltip.
 * @param position - The position of the tooltip relative to the child element.
 * @param children - The child element that the tooltip will be displayed on.
 * @param boundingClassName - The class name(s) to be applied to the outer container div.
 * @param popoverClassName - The class name(s) to be applied to the tooltip element.
 */
export const Tooltip = ({ text, position = 'top', children, boundingClassName, popoverClassName }: Props) => {
  const [isTooltipVisible, setIsTooltipVisible] = useState(false)

  const tooltipClasses = `min-w-[200px] max-w-[200px] absolute bg-slate-800 text-white px-2 py-1 rounded text-sm ${
    position === 'top'
      ? 'bottom-full left-1/2 transform -translate-x-1/2 mb-1'
      : position === 'bottom'
      ? 'top-full left-1/2 transform -translate-x-1/2 mt-1'
      : position === 'left'
      ? 'top-1/2 right-full transform -translate-y-1/2 mr-1'
      : 'top-1/2 left-full transform -translate-y-1/2 ml-1'
  } ${isTooltipVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'} ${popoverClassName}`

  return (
    <div className={`relative inline ${boundingClassName}`}>
      <div className={`z-20 ${tooltipClasses}`}>{text}</div>
      <div
        onMouseEnter={() => setIsTooltipVisible(true)}
        onMouseLeave={() => setIsTooltipVisible(false)}
        className='inline'
      >
        {children}
      </div>
    </div>
  )
}
