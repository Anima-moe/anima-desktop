import { ArrowLeft } from 'phosphor-react'
import React from 'react'

type Props = {
  onClick?: () => void
}

function BackButton({onClick}: Props) {
  return <div className='w-12 h-12 flex items-center hover:bg-primary hover:text-accent cursor-pointer pointer-events-auto justify-center rounded-md mr-4 text-white text-opacity:80 hover:text-opacity-100' onClick={onClick}>
  <ArrowLeft size={28} />
</div>
}

export default BackButton