import clsx from 'clsx'
import { SkipBack, ArrowElbowUpRight, SkipForward } from 'phosphor-react'

import { useMediaStore, useMediaRemote } from '@vidstack/react'

type Props = {
  time: number
}

function PlayButton({ time }: Props) {
  const remote = useMediaRemote()
  const { currentTime } = useMediaStore()
  const classes = clsx({
    'flex items-center justify-center cursor-pointer group pointer-events-auto hover:text-accent hover:bg-primary duration-200 h-full aspcet-square rounded-md aspect-square w-12':
      true,
  })
  return (
    <div
      className={classes}
      onClick={() => {
        remote.seek(currentTime + time)
      }}
    >
      {time < 0 && (
        <SkipBack
          weight="fill"
          className="order-2 h-6 w-6 opacity-50 duration-300 group-hover:opacity-100"
        />
      )}
      {time === 0 && (
        <ArrowElbowUpRight
          weight="fill"
          className="h-6 w-6 opacity-50 duration-300 group-hover:opacity-100 "
        />
      )}
      {time > 0 && (
        <SkipForward
          weight="fill"
          className="h-6 w-6 opacity-50 duration-300 group-hover:opacity-100 "
        />
      )}
      {/* <span className='text-sm mt-1 text-opacity-50 text-white group-hover:text-opacity-100 duration-300'>{time}</span> */}
    </div>
  )
}

export default PlayButton
