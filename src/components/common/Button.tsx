import React, { forwardRef } from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text?: string
  padding?: string
}

export const Button = forwardRef(
  (
    { text = '', onClick, type, disabled, className, padding = 'px-4 py-2' }: ButtonProps,
    ref: React.Ref<HTMLButtonElement>
  ) => {
    return (
      <button
        type={type}
        onClick={onClick}
        className={`inline-flex justify-center rounded-md border border-transparent bg-emerald-100 font-medium text-emerald-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 enabled:hover:bg-emerald-200 disabled:opacity-75 ${padding} ${className}`}
        disabled={disabled}
        ref={ref}
      >
        {text}
      </button>
    )
  }
)

Button.displayName = 'Button'
