import { ReactNode } from 'react'

import clsx from 'clsx'

import { useMediaStore } from '@vidstack/react'

type Props = {
  children: ReactNode
  bottom?: boolean
  top?: boolean
  middle?: boolean
}

function ControlsContainer({ children, bottom, middle, top }: Props) {
  const { duration, canPlay } = useMediaStore()

  const classNames = clsx({
    'media-user-idle:translate-y-32 media-user-idle:opacity-0 flex-col hidden media-can-play:flex':
      bottom,
    'media-user-idle:-translate-y-32 media-user-idle:opacity-0': top,
    'h-full flex-col overflow-hidden': middle,
    'flex p-4 w-full z-[1] h-min w-full duration-300 transition-all relative relative': true,
    hidden: bottom && duration < 30 && canPlay,
  })
  return <div className={classNames}>{children}</div>
}

export default ControlsContainer
