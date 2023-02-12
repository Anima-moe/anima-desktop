import type { ReactNode } from 'react'

import type { IconProps } from 'phosphor-react'

type Props = {
  Icon: React.ForwardRefExoticComponent<IconProps & React.RefAttributes<SVGSVGElement>>,
  children: ReactNode,
  color?: string
}

function Pill({Icon, children, color}: Props) {
  return (
    <div className="bg-secondary border border-tertiary flex items-center rounded-full px-3 py-1 text-sm mr-3 hover:bg-black hover:text-primary duration-300" style={{color}}>
      <Icon className="mr-2" weight='fill'/> {children}
    </div>
  )
}

export default Pill