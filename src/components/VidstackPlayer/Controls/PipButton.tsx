import { useEffect, useRef, useState } from 'react'

import { PictureInPicture } from 'phosphor-react'

import { MediaToggleButton } from '@vidstack/react'
import { useMediaStore, useMediaRemote } from '@vidstack/react'


type Props = {}

function PipButton({}: Props) {
  const pipReference = useRef(null)
  const [pipStatus, setPip] = useState(false)

  useEffect(() => {
    if (navigator.userAgent.toLowerCase().indexOf('firefox') > -1) {
      pipReference?.current?.remove?.()
    }

    const video = document.querySelector('video')
    video.addEventListener('enterpictureinpicture', () => {
      setPip(true)
    })
    video.addEventListener('leavepictureinpicture', () => {
      setPip(false)
    })
  }, [])
  
  return <button  className='flex items-center justify-center group cursor-pointer pointer-events-auto'>
    <PictureInPicture weight='fill' className='block w-6 h-6 group-hover:scale-110 duration-300 ml-6' onClick={() => {
        const video = document.querySelector('video')

        if (pipStatus) {
          document.exitPictureInPicture?.()
        } else {
          video.requestPictureInPicture?.()
        }

        setPip(!pipStatus)
      }} />
  </button >
}

export default PipButton