import React, { forwardRef } from 'react'
import { IconType } from 'react-icons'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text?: string
  Icon?: IconType
  iconClassName?: string
  overrideDefaultStyle?: boolean
}

export const Button = forwardRef(
  (
    {
      text = '',
      Icon,
      onClick,
      type,
      disabled = false,
      className = '',
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
        disabled={disabled}
        ref={ref}
      >
        {Icon && <Icon className={iconClassName} />}
        {text}
      </button>
    )
  }
)

Button.displayName = 'Button'
