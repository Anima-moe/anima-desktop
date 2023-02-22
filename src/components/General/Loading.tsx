import React from 'react'

import clsx from 'clsx'
import { CircleNotch } from 'phosphor-react'

type Props = {
  xs?: boolean
  sm?: boolean
  md?: boolean
  lg?: boolean
  inline?: boolean
}

function Loading({ sm, md, lg, xs, inline }: Props) {
  const classes = clsx({
    'h-6 w-6': xs,
    'h-12 w-12': sm,
    'h-24 w-24': md || (!xs && !sm && !lg),
    'h-48 w-48': lg,
    'w-full h-full': !inline,
    ['items-center justify-center flex']: true,
  })
  return (
    <div className={classes}>
     <CircleNotch size={100} className="animate-spin" />
    </div>
  )
}

export default Loading
