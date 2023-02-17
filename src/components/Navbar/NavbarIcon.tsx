import React from 'react'

type Props = {
  title: string
  Icon: React.ReactNode
  onClick?: () => void
}

function NavbarIcon({ title, Icon, onClick }: Props) {
  return (
    <div className="flex aspect-square h-full cursor-pointer items-center justify-center rounded-md border border-tertiary border-opacity-50 bg-secondary bg-opacity-60 p-2 text-subtle backdrop-blur-sm duration-300 hover:border-tertiary hover:bg-black hover:text-white active:border-accent active:bg-accent active:text-primary">
      {Icon}
    </div>
  )
}

export default NavbarIcon
