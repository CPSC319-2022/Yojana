import React, { forwardRef } from 'react'
import { Icon, IconName } from '@/components/common/Icon'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text?: string
  iconName?: IconName
  iconClassName?: string
  overrideDefaultStyle?: boolean
}

export const Button = forwardRef(
  (
    {
      text = '',
      iconName,
      onClick,
      type,
      disabled = false,
      className = '',
      id = '',
      iconClassName = '',
      overrideDefaultStyle = false
    }: ButtonProps,
    ref: React.Ref<HTMLButtonElement>
  ) => {
    return (
      <button
        type={type}
        onClick={onClick}
        className={
          overrideDefaultStyle
            ? className
            : `inline-flex justify-center rounded-md border border-transparent bg-emerald-100 px-4 py-2 font-medium text-emerald-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 enabled:hover:bg-emerald-200 disabled:opacity-75 ${className}`
        }
        id={id}
        disabled={disabled}
        ref={ref}
      >
        {text}
        {iconName && <Icon iconName={iconName} className={iconClassName} />}
      </button>
    )
  }
)

Button.displayName = 'Button'
