import clsx from 'clsx'
import { ArrowCounterClockwise, ArrowElbowUpRight, ArrowClockwise } from 'phosphor-react'

import { useMediaStore, useMediaRemote } from '@vidstack/react'

type Props = {
  time: number
}

function PlayButton({ time }: Props) {
  const remote = useMediaRemote()
  const { currentTime } = useMediaStore()
  const classes = clsx({
    'flex items-center justify-center cursor-pointer group pointer-events-auto hover:text-accent':
      true,
    'mr-4': time < 0,
    'ml-4': time > 0,
  })
  return (
    <div
      className={classes}
      onClick={() => {
        remote.seek(currentTime + time)
      }}
    >
      {time < 0 && (
        <ArrowCounterClockwise
          weight="fill"
          className="order-2 h-5 w-6 opacity-50 duration-300 group-hover:opacity-100 hover:-rotate-90"
        />
      )}
      {time === 0 && (
        <ArrowElbowUpRight
          weight="fill"
          className="h-5 w-5 opacity-50 duration-300 group-hover:opacity-100"
        />
      )}
      {time > 0 && (
        <ArrowClockwise
          weight="fill"
          className="h-5 w-5 opacity-50 duration-300 group-hover:opacity-100  hover:rotate-90"
        />
      )}
      {/* <span className='text-sm mt-1 text-opacity-50 text-white group-hover:text-opacity-100 duration-300'>{time}</span> */}
    </div>
  )
}

export default PlayButton
