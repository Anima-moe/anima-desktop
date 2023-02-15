import { useState } from 'react'

import { useRouter } from 'next/router'
import { ArrowsOut, ArrowsIn } from 'phosphor-react'

import { MediaToggleButton } from '@vidstack/react'
import { useMediaStore, useMediaRemote } from '@vidstack/react'



type Props = {}

function FullscreenButton({}: Props) {
  const [ fullscreen, setFullscreen ] = useState(false)
  const remote = useMediaRemote()
  const router = useRouter()
  
  return <MediaToggleButton  className='flex items-center justify-center group cursor-pointer pointer-events-auto ml-auto' onClick={()=>{
    import('@tauri-apps/api/window')
      .then((mod)=>{
        setFullscreen(!fullscreen)
        
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
      className={`${fullscreen ? 'hidden' : 'block'} w-6 h-6 group-hover:scale-110 duration-300`}
    />
    <ArrowsIn 
      weight='fill' 
      className={`${fullscreen ? 'block' : 'hidden'} w-6 h-6 group-hover:scale-110 duration-300`} 
    />
  </MediaToggleButton >
}

export default FullscreenButton