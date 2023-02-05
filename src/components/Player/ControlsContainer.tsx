import clsx from 'clsx';
import { ReactNode } from 'react';

type Props = {
  children: ReactNode
  bottom?: boolean
  top?: boolean
  middle?: boolean
}

function ControlsContainer({children, bottom, middle, top}: Props) {
  const classNames = clsx({
    'media-user-idle:translate-y-32 media-user-idle:opacity-0 flex-col': bottom,
    'media-user-idle:-translate-y-32 media-user-idle:opacity-0': top,
    'h-full media-user-idle:opacity-0 items-center justify-center': middle,
    'flex p-4 w-full items-center z-[1] h-min w-full duration-300 transition-all relative relative' : true
  })
  return (
    <div className={classNames + ' place-self-end justify-self-end'}>
      {children}
    </div>
  )
}

export default ControlsContainer