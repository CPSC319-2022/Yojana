import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text: string
}

export const Button = ({ text, onClick, type, disabled, className }: ButtonProps) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`inline-flex justify-center rounded-md border border-transparent bg-emerald-100 px-4 py-2 text-sm font-medium text-emerald-900 hover:bg-emerald-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 ${className}`}
      disabled={disabled}
    >
      {text}
    </button>
  )
}
