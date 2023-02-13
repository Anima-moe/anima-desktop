import React from 'react'

type Props = {
  title: string
  Icon: React.ReactNode
  onClick?: () => void
}

function NavbarIcon({title, Icon, onClick}: Props) {
  return (
    <div className='h-full aspect-square bg-secondary border border-tertiary rounded-md flex items-center justify-center p-2 text-subtle hover:text-white hover:bg-black duration-300 hover:border-tertiary cursor-pointer active:bg-accent active:border-accent active:text-primary bg-opacity-60 backdrop-blur-sm border-opacity-50'>
      {Icon}
    </div>
  )
}

export default NavbarIcon