import React from 'react'

import Link from 'next/link'
import { ArrowLeft } from 'phosphor-react'

type Props = {
  target: string
}

function BackButton({ target }: Props) {
  return (
    <Link href={target}>
      <div className="text-opacity:80 pointer-events-auto mr-4 flex h-12 w-12 cursor-pointer items-center justify-center rounded-md text-white hover:bg-black hover:text-accent hover:text-opacity-100">
        <ArrowLeft size={28} />
      </div>
    </Link>
  )
}

export default BackButton
