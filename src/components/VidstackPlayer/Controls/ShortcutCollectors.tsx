import { KeyboardEvent, useCallback, useEffect } from 'react'

import { useMediaPlayer } from '@vidstack/react'
const preventOverrideOnElements = ['INPUT', 'TEXTAREA']

function ShortcutCollector() {
  const playerElement = useMediaPlayer()

  useEffect(()=>{
    if (!playerElement || !playerElement.provider) { return } // If there's no provider, there's also no video.
    const videoElement = playerElement?.querySelector('video')
    if (!videoElement) { return }

    function onKeyPress (e: any) {
      if (preventOverrideOnElements.includes(document.activeElement.tagName)) { return } // prevents overriding input on input elements


			if (!e.shiftKey && !e.ctrlKey && !e.altKey && !e.metaKey) {
				switch(e.key) {
          case ']':
					case 'BracketRight':
					case 'Equal': {
						videoElement.playbackRate+=0.1
						e.preventDefault()
						break
          };
          case '[':
					case 'BracketLeft':
					case 'Minus': {
						videoElement.playbackRate-=0.1
						e.preventDefault()
						break
          };
					case '0': {
						videoElement.playbackRate = 1
						break
          };
          case ' ':
          case 'Space': {
            e.preventDefault()
            if(playerElement.provider.paused) {
              playerElement.provider.play()
            } else {
              playerElement.provider.pause()
            }
            break
          };
          case 'm': {
            const currentVolume = Object.freeze(videoElement.volume)
            const userVolume = Number(localStorage.getItem('puray.userVolume')) || 1
            
            if (currentVolume !== 0 && userVolume !== 0) {
              videoElement.volume = 0
              setTimeout(()=>{
                localStorage.setItem('puray.userVolume', currentVolume.toString())
              })
            } 

            if (currentVolume === 0) {
              videoElement.volume = Number(localStorage.getItem('puray.userVolume')) || 1
            }

            e.preventDefault()
            break
          };
          case 'l':
          case 'ArrowRight': {
            videoElement.currentTime+=5
            e.preventDefault()
            break
          };
          case 'j':
          case 'ArrowLeft': {
            videoElement.currentTime-=5
            e.preventDefault()
            break
          };
          case 'ArrowUp': {
            videoElement.volume = Math.min(videoElement.volume + 0.1, 1)
            e.preventDefault()
            break
          };
          case 'ArrowDown': {
            videoElement.volume = Math.max(videoElement.volume - 0.1, 0)
            e.preventDefault()
            break
          };
				}
			}
    }

    document.addEventListener('keydown', onKeyPress)

    return () => {
      document.removeEventListener('keydown', onKeyPress)
    }
  }, [playerElement])

  return (
    <div></div>
  )
}

export default ShortcutCollector