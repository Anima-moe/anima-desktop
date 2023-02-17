import { useState } from 'react'

import { useRouter } from 'next/router'
import { ArrowsOut, ArrowsIn } from 'phosphor-react'

import { MediaToggleButton } from '@vidstack/react'
import { useMediaStore, useMediaRemote } from '@vidstack/react'

type Props = {}

function FullscreenButton({}: Props) {
  const [fullscreen, setFullscreen] = useState(false)
  const remote = useMediaRemote()
  const router = useRouter()

  return (
    <MediaToggleButton
      className="group pointer-events-auto ml-auto flex cursor-pointer items-center justify-center"
      onClick={() => {
        import('@tauri-apps/api/window').then((mod) => {
          setFullscreen(!fullscreen)

          mod.getCurrent().setFullscreen(!fullscreen)

          router.events.on('routeChangeStart', () => {
            mod.getCurrent().setFullscreen(false)
          })
        })
      }}
    >
      <ArrowsOut
        weight="fill"
        className={`${fullscreen ? 'hidden' : 'block'} h-6 w-6 duration-300 group-hover:scale-110`}
      />
      <ArrowsIn
        weight="fill"
        className={`${fullscreen ? 'block' : 'hidden'} h-6 w-6 duration-300 group-hover:scale-110`}
      />
    </MediaToggleButton>
  )
}

export default FullscreenButton
