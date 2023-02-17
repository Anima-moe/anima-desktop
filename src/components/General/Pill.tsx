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
      className="mr-3 flex items-center rounded-full border border-tertiary bg-secondary px-3 py-1 text-sm duration-300 hover:bg-black hover:text-primary"
      style={{ color }}
    >
      <Icon className="mr-2" weight="fill" /> {children}
    </div>
  )
}

export default Pill
