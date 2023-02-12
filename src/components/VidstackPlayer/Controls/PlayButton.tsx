import { Play, Pause } from 'phosphor-react'

import { MediaToggleButton } from '@vidstack/react'
import { useMediaStore, useMediaRemote } from '@vidstack/react'

type Props = {}

function PlayButton({}: Props) {
  const { paused } = useMediaStore()
  const remote = useMediaRemote()
  
  return <MediaToggleButton  className='flex items-center justify-center group cursor-pointer pointer-events-auto hover:text-accent' onClick={()=>{
    paused ? remote.play() : remote.pause()
  }}>
    <Play weight='fill' className='hidden media-paused:block w-5 h-5 group-hover:scale-110 duration-300' />
    <Pause weight='fill' className='block media-paused:hidden w-5 h-5  group-hover:scale-110 duration-300' />
  </MediaToggleButton >
}

export default PlayButton