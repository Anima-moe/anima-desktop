import React from 'react'

type Props = {
  title: string
  Icon: React.ReactNode
  onClick?: () => void
}

function NavbarIcon({ title, Icon, onClick }: Props) {
  return (
    <div 
      className="flex items-center justify-center p-2 duration-300 border-opacity-50 rounded-md cursor-pointer w-11 h-11 bg-opacity-60 backdrop-blur-sm hover:border-tertiary hover:bg-black hover:text-white active:border-accent active:bg-accent active:text-primary"
      onClick={()=>{
        onClick?.()
      }}
    >
      {Icon}
    </div>
  )
}

export default NavbarIcon
