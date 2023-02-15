import clsx from 'clsx'
import { Icon } from 'phosphor-react'

type Props = {
  Icon: Icon
  placeholder?: string
  type?: string
  error?: string
  onChange?: (value: string) => void
}

function IconInput({ Icon, placeholder, type, error, onChange }: Props) {
  return (
    <>
      <div className="relative my-1.5 flex w-full items-center justify-start">
        <input
          className={clsx(
            'w-full rounded-md border px-3 py-2.5 pl-12 text-lg text-white outline-none placeholder-shown:text-subtle focus:ring-0 focus:ring-offset-0 active:text-white',
            error ? 'border-red-500 bg-[#240505]' : 'border-tertiary bg-secondary'
          )}
          placeholder={placeholder}
          type={type}
          onChange={(e) => {
            onChange?.(e.target.value)
          }}
        />
        <Icon size={24} className="absolute left-3 top-1/2 -translate-y-1/2 text-subtle" />
      </div>
      {error && (
        <span className="mb-1.5 -mt-2 w-full rounded-b bg-red-500 px-2 text-xs">{error}</span>
      )}
    </>
  )
}

export default IconInput
