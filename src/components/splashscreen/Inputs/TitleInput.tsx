import { HTMLInputTypeAttribute } from 'react'

import clsx from 'clsx'

export type TitleInputProps = {
  title: string
  footer?: string
  type?: HTMLInputTypeAttribute
  error?: string
  onChange?: (value: string) => void
}

function TitleInput({ title, footer, type, error, onChange }: TitleInputProps) {
  return (
    <>
      <div className="relative my-1.5 flex w-full flex-col">
        <span className="text-lg text-subtle">{title}</span>
        <input
          className={clsx(
            'w-full rounded-md border px-3 py-2.5 text-lg text-white outline-none placeholder-shown:text-subtle focus:ring-0 focus:ring-offset-0 active:text-white',
            error ? 'border-red-500 bg-[#240505]' : 'border-tertiary bg-secondary'
          )}
          type={type}
          onChange={(e) => {
            onChange?.(e.target.value)
          }}
        />
      </div>
      {footer && <span className="text-sm text-tertiary">{title}</span>}
      {error && (
        <span className="mb-1.5 -mt-2 w-full rounded-b bg-red-500 px-2 text-xs">{error}</span>
      )}
    </>
  )
}

export default TitleInput
