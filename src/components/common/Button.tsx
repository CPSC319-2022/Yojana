import React, { forwardRef } from 'react'
import { Icon, IconName } from '@/components/common/Icon'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text?: string
  iconName?: IconName
  iconClassName?: string
  ariaLabel?: string
  overrideDefaultStyle?: boolean
  useLargeIcon?: boolean
}

/**
 * * A customizable button component that can display text and an optional icon.
 * * Overriding default styling is possible if needed.
 */
export const Button = forwardRef(
  (
    {
      text = '',
      iconName,
      onClick,
      type = 'button',
      disabled = false,
      className = '',
      id = '',
      iconClassName = '',
      overrideDefaultStyle = false,
      ariaLabel,
      useLargeIcon
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
            : `inline-flex justify-center rounded-md border border-transparent bg-emerald-100 px-4 py-2 font-medium text-emerald-900 focus:outline-none enabled:hover:bg-emerald-200 disabled:opacity-75 ${className}`
        }
        id={id}
        disabled={disabled}
        ref={ref}
        aria-label={ariaLabel}
      >
        {text}
        {iconName && <Icon iconName={iconName} className={iconClassName} size={useLargeIcon ? 20 : undefined} />}
      </button>
    )
  }
)

Button.displayName = 'Button'
