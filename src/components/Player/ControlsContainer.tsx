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
    'mt-auto': bottom,
    'mb-auto': top,
    'h-full': middle,
    'flex py-4 w-full items-center z-[1] px-4 h-min w-full bg-blue-300' : true
  })
  return (
    <div className={classNames + 'place-self-end justify-self-end '}>
      {children}
    </div>
  )
}

export default ControlsContainer