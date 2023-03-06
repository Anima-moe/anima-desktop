import { useEffect, useRef, useState } from 'react'

import { useAtom } from 'jotai'
import SubtitleOctopus from 'libass-wasm'

import { playerStreamConfig } from '@/stores/atoms'
import { useMediaPlayer } from '@vidstack/react'

interface ISubstationAlphaProps {
}

const SubstationAlphaDecoder: React.FunctionComponent<ISubstationAlphaProps> = (props) => {
  const MediaPlayer = useMediaPlayer()
  const [streamConfig] = useAtom(playerStreamConfig)
  const [subtitleRenderer, setSubtitleRenderer] = useState(null)
  const canvas = useRef<HTMLCanvasElement>(null)

  const clearRenderer = () => {
    if (!subtitleRenderer) { return }
    subtitleRenderer.freeTrack()
  }

  useEffect(()=>{
    if (!MediaPlayer) { return }
    if (!canvas.current) { return }
    const videoElement = MediaPlayer?.querySelector('video')

    // User disabled his subtitles | User prefered subtitles is Disabled
    if (subtitleRenderer && streamConfig.subtitleURL === '' || streamConfig.subtitleLocale === 'Disabled') {
      return clearRenderer()
    }

    // User swapped subtitles | User prefered subtitles is Enabled
    if (streamConfig.subtitleURL) {
      if (!subtitleRenderer) {
        // Renderer doesn't exist, create it
        setSubtitleRenderer(new SubtitleOctopus({
          video: videoElement,
          subUrl: streamConfig.subtitleURL,
          workerUrl: '/s/subtitles-octopus-worker.js',
          legacyWorkerUrl: '/s/subtitles-octopus-worker-legacy.js',
          fonts: ['/s/trebuc.woff', '/s/default.woff2']
        }))

        MediaPlayer.addEventListener('loaded-metadata', () => {
          
        }, { once: true })
      } else {
        // Renderer exists, swap URL
        subtitleRenderer.setTrackByUrl(streamConfig.subtitleURL)
      }
    }     

    return ( () => { if (subtitleRenderer) { 
      clearRenderer() 
    } })

  }, [streamConfig.subtitleURL, streamConfig.streamURL, MediaPlayer, canvas])

  return <canvas className='w-full h-full absolute inset-0 z-[3] libassjs-canvas' ref={canvas}/>
}

export default SubstationAlphaDecoder
