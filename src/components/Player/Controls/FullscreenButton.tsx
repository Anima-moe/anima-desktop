import { MediaToggleButton } from '@vidstack/react'
import { ArrowsOut, ArrowsIn } from 'phosphor-react'
import { useMediaStore, useMediaRemote } from '@vidstack/react'
import { useRouter } from 'next/router'

type Props = {}

function FullscreenButton({}: Props) {
  const { fullscreen } = useMediaStore()
  const remote = useMediaRemote()
  const router = useRouter()
  
  return <MediaToggleButton  className='flex items-center justify-center group cursor-pointer pointer-events-auto' onClick={()=>{
    console.log("toggle Fullscreen", fullscreen)
    import('@tauri-apps/api/window')
      .then((mod)=>{
        mod
          .getCurrent()
          .setFullscreen(!fullscreen)

        router.events.on('routeChangeStart', ()=>{
          mod
            .getCurrent()
            .setFullscreen(false)
        })

      })

  }}>
    <ArrowsOut 
      weight='fill' 
      className='block media-fullscreen:hidden w-6 h-6 group-hover:scale-110 duration-300 ml-6' 
    />
    <ArrowsIn 
      weight='fill' 
      className='hidden media-fullscreen:block w-6 h-6  group-hover:scale-110 duration-300 ml-6' 
    />
  </MediaToggleButton >
}

export default FullscreenButton