import React from 'react'

type Props = {
  title: string
  Icon: React.ReactNode
  onClick?: () => void
}

function NavbarIcon({title, Icon, onClick}: Props) {
  return (
    <div className='h-full aspect-square bg-secondary border border-tertiary ml-3 rounded-md flex items-center justify-center p-2 text-subtle hover:text-accent hover:bg-black duration-300 hover:border-accent cursor-pointer'>
      {Icon}
    </div>
  )
}

export default NavbarIcon