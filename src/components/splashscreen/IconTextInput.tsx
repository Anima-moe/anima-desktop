import React from 'react'
import { IconType } from 'react-icons'

type Props = {
  Icon: IconType
  placeholder?: string
  type?: string
}

function IconInput({Icon, placeholder, type}: Props) {
  return <div className='flex items-center justify-start w-full relative my-1.5'>
    <input className='w-full rounded-md bg-secondary text-lg pl-12 px-3 py-2.5 border border-tertiary active:text-white placeholder-shown:text-subtle text-white' placeholder={placeholder} type={type}/>
    <Icon size={24} className='absolute text-subtle left-3 top-1/2 -translate-y-1/2'/>
  </div>
}

export default IconInput