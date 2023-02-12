import React from 'react'

import clsx from 'clsx'

type Props = {
  xs?: boolean
  sm?: boolean
  md?: boolean
  lg?: boolean
  inline?: boolean
}

function Loading({sm, md, lg, xs, inline}: Props) {
  const classes = clsx({
    'h-6 w-6': xs,
    'h-12 w-12': sm,
    'h-24 w-24': md || (!xs && !sm && !lg),
    'h-48 w-48': lg,
    'w-full h-full': !inline,
    ['items-center justify-center flex']: true
  })
  return (
    <div className={classes}>
      <svg className="animate-spin -ml-1 mr-3w-full h-full text-accent" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    </div>
  )
}

export default Loading