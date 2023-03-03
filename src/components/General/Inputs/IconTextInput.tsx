import { HTMLInputTypeAttribute, InputHTMLAttributes, PropsWithChildren, forwardRef } from 'react'

import clsx from 'clsx'
import { Icon } from 'phosphor-react'

type Props = InputHTMLAttributes<HTMLInputElement> & {
  Icon: Icon
  id?: string
  placeholder?: string
  type?: HTMLInputTypeAttribute
  error?: string
  className?: string
}

const IconInput = forwardRef<InputHTMLAttributes<HTMLInputElement>, PropsWithChildren<Props>>(
  ({ id, Icon, placeholder, type, error, className, children, ...props }, ref) => (
    <div className="flex flex-col w-full">
      <div className="relative my-1.5 flex w-full items-center justify-start">
        <input
          id={id}
          className={clsx(
            'w-full rounded-md border px-3 py-2.5 pl-12 text-lg text-white outline-none placeholder-shown:text-subtle focus:ring-0 focus:ring-offset-0 active:text-white',
            error ? 'border-red-500 bg-[#240505]' : 'border-tertiary bg-secondary',
            className
          )}
          placeholder={placeholder}
          type={type}
          autoComplete='off'
          {...props}
        />
        <Icon size={24} className="absolute left-3 top-1/2 -translate-y-1/2 text-subtle" />
        {children}
      </div>
      {error && (
        <span className="mb-1.5 -mt-3 w-full rounded-b bg-red-500 px-2 pt-1 text-xs">{error}</span>
      )}
    </div>
  )
)
IconInput.displayName = 'IconInput'

export default IconInput
