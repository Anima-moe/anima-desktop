import { Play, Pause } from 'phosphor-react'

type Props = {}

function PlayButton({}: Props) {
  return <div className='flex items-center justify-center group cursor-pointer pointer-events-auto'>
    <Play weight='fill' className='hidden media-paused:block w-12 h-12 group-hover:scale-110 duration-300' />
    <Pause weight='fill' className='block media-paused:hidden w-12 h-12  group-hover:scale-110 duration-300' />
  </div>
}

export default PlayButton