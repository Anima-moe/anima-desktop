import { Play, Pause } from 'phosphor-react'

import { MediaToggleButton } from '@vidstack/react'
import { useMediaStore, useMediaRemote } from '@vidstack/react'

type Props = {}

function PlayButton({}: Props) {
  const { paused } = useMediaStore()
  const remote = useMediaRemote()

  return (
    <MediaToggleButton
      className="group pointer-events-auto flex cursor-pointer items-center justify-center hover:text-accent hover:bg-primary duration-200 aspect-square w-12 rounded-md"
      onClick={() => {
        paused ? remote.play() : remote.pause()
      }}
    >
      <Play
        weight="fill"
        className="hidden h-6 w-6 duration-300 media-paused:block "
      />
      <Pause
        weight="fill"
        className="block h-8 w-8 duration-300 media-paused:hidden "
      />
    </MediaToggleButton>
  )
}

export default PlayButton
