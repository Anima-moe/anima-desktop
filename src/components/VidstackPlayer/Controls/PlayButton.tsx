import { Play, Pause } from 'phosphor-react'

import { MediaToggleButton } from '@vidstack/react'
import { useMediaStore, useMediaRemote } from '@vidstack/react'

type Props = {}

function PlayButton({}: Props) {
  const { paused } = useMediaStore()
  const remote = useMediaRemote()

  return (
    <MediaToggleButton
      className="group pointer-events-auto flex cursor-pointer items-center justify-center hover:text-accent"
      onClick={() => {
        paused ? remote.play() : remote.pause()
      }}
    >
      <Play
        weight="fill"
        className="hidden h-5 w-5 duration-300 group-hover:scale-110 media-paused:block"
      />
      <Pause
        weight="fill"
        className="block h-5 w-5 duration-300  group-hover:scale-110 media-paused:hidden"
      />
    </MediaToggleButton>
  )
}

export default PlayButton
