import type { ReactNode } from 'react'
import type { IconType } from 'react-icons'

type Props = {
  Icon: IconType,
  children: ReactNode,
  color?: string
}

function Pill({Icon, children, color}: Props) {
  return (
    <div className="bg-background-blur backdrop-blur-md border border-border-blur border-opacity-20 flex items-center rounded-full bg-opacity-30 px-2 text-sm mr-3" style={{color}}>
      <Icon  className="mr-2"/> {children}
    </div>
  )
}

export default Pill