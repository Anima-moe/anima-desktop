import React from 'react'

import { Icon } from 'phosphor-react'

type Props = {
  Icon: Icon
  placeholder?: string
  type?: string
  error?: string
  onChange?: (value: string) => void
}

function IconInput({Icon, placeholder, type, error, onChange}: Props) {
  return <>
    <div className='flex items-center justify-start w-full relative my-1.5'>
      <input className={`w-full rounded-md text-lg pl-12 px-3 py-2.5 border ${error ? 'bg-[#240505] border-red-500' : 'bg-secondary border-tertiary'} active:text-white placeholder-shown:text-subtle text-white focus:ring-0 focus:ring-offset-0 outline-none`} placeholder={placeholder} type={type} onChange={(e)=>{
        onChange?.(e.target.value)
      }}/>
      <Icon size={24} className='absolute text-subtle left-3 top-1/2 -translate-y-1/2'/>
    </div>
    {error && <span className='bg-red-500 mb-1.5 rounded-b px-2 text-xs -mt-2 w-full'>{error}</span> }
  </>
}

export default IconInput