import { ReactNode } from 'react'

import clsx from 'clsx'
type Props = {
  Icon?: JSX.Element | ReactNode | JSX.Element[] | ReactNode[]
  fluid?: boolean
  text: string
  primary?: boolean
  secondary?: boolean
  tertiary?: boolean
  accent?: boolean
  subtle?: boolean
  error?: boolean
  success?: boolean
  transparent?: boolean
  xs?: boolean
  sm?: boolean
  md?: boolean
  lg?: boolean
  xl?: boolean
  disabled?: boolean
  border?: boolean
  className?: string
  iconClassName?: string
  iconLeft?: boolean
  iconRight?: boolean
  semibold?: boolean
  bold?: boolean
  onClick?: () => void
  iconSubtle?: boolean
  children?: ReactNode
  loading?: boolean
}

function Button({
  Icon,
  fluid,
  text,
  primary,
  secondary,
  subtle,
  tertiary,
  accent,
  error,
  success,
  transparent,
  xs,
  sm,
  md,
  lg,
  xl,
  disabled,
  border,
  className,
  iconClassName,
  iconRight,
  iconLeft,
  semibold,
  bold,
  iconSubtle,
  onClick,
  children,
  loading,
}: Props) {
  const classes = clsx({
    'bg-primary': primary && !disabled,
    'bg-secondary hover:bg-tertiary': secondary && !disabled,
    'bg-tertiary hover:bg-secondary': tertiary && !disabled,
    'bg-error': error && !disabled,
    'bg-success': success && !disabled,
    'bg-transparent': transparent && !disabled,
    'bg-accent hover:bg-black hover:text-accent text-primary': accent && !disabled,
    'text-white': primary || secondary || tertiary || error || (success && !disabled),
    '!text-subtle': subtle && !disabled,
    'border border-tertiary border-opacity-50': border && subtle,
    'border border-tertiary': border && !subtle,
    'border border-transparent': !border,
    'w-full justify-between': fluid,
    'text-xs': xs,
    'text-sm': sm,
    'text-base': md,
    'text-lg': lg,
    'text-xl': xl,
    'cursor-not-allowed bg-secondary text-white text-opacity-40': disabled,
    'font-semibold': semibold,
    'font-bold': bold,
    'cursor-pointer': !disabled,
    'flex items-center justify-start py-3 px-4 rounded-md duration-300 h-min placeholder:text-subtle relative select-none':
      true,
    [className]: true,
  })

  const iconClasses = clsx({
    'ml-2 order-last': iconRight && !fluid,
    'mr-2 order-first': iconLeft && !fluid,
    'text-subtle': iconSubtle,
    [iconClassName]: true,
  })

  const contentClassName = clsx({
    'order-first': iconRight,
    'order-last': iconLeft,
  })

  return (
    <button
      className={classes}
      onClick={() => {
        if (disabled) return
        if (!onClick) return 
        onClick()
      }}
    >
      <span className="flex items-center">
        <span className={contentClassName}>{children}</span>
        {loading && (
          <div className="absolute top-0 left-0 flex h-full w-full items-center justify-center bg-primary bg-opacity-40">
            <svg
              className="-ml-1 mr-3 h-5 w-5 animate-spin text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </div>
        )}
        {text}
      </span>
      {Icon && Icon}
    </button>
  )
}

export default Button
