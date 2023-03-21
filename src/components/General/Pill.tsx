import type { ReactNode } from 'react'

import type { IconProps } from 'phosphor-react'

type Props = {
  Icon: React.ForwardRefExoticComponent<IconProps & React.RefAttributes<SVGSVGElement>>
  children: ReactNode
  color?: string
}

function Pill({ Icon, children, color }: Props) {
  return (
    <div
      className="flex items-center px-3 py-1 text-xs duration-300 border rounded-full select-none border-tertiary bg-secondary"
      style={{ color }}
    >
      <Icon className="mr-2" weight="fill" /> {children}
    </div>
  )
}

export default Pill
