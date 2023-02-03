import Link from 'next/link'
import { ArrowLeft } from 'phosphor-react'
import React from 'react'

type Props = {
  target:string
}

function BackButton({target}: Props) {
  return <Link href={target}>
    <div className='w-12 h-12 flex items-center hover:bg-black hover:text-accent cursor-pointer pointer-events-auto justify-center rounded-md mr-4 text-white text-opacity:80 hover:text-opacity-100'>
    <ArrowLeft size={28} />
  </div>
</Link>
}

export default BackButton