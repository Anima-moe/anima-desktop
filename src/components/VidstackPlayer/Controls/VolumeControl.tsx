import { useEffect } from 'react'

import { useAtom } from 'jotai'
import { SpeakerHigh, SpeakerSimpleHigh } from 'phosphor-react'
import { debounce } from 'ts-debounce'

import { userPreferedVolume } from '@/stores/atoms'
import * as Popover from '@radix-ui/react-popover'
import * as Slider from '@radix-ui/react-slider'
import { useMediaPlayer, useMediaRemote, useMediaStore } from '@vidstack/react'

export default function VolumeControl() {
  const [userVolume, setUserVolume] = useAtom(userPreferedVolume)
  const mediaRemote = useMediaRemote()
  const mediaPlayer = useMediaPlayer()
  const { volume } = useMediaStore()

  useEffect(()=>{
    if (!mediaPlayer) { return }

    mediaPlayer.addEventListener('play', ()=>{
      if (userVolume) {
        mediaRemote.changeVolume(parseFloat(userVolume))
      }
    }, { once: true })
  }, [mediaPlayer])

  const debounceVolume = debounce((value: number) => {
    mediaRemote.changeVolume(value)
    setUserVolume(value.toString())
  }, 150)

  return (
    <Popover.Root
      onOpenChange={(o) => {
        if (o) {
          mediaRemote.pauseUserIdle()
        } else {
          mediaRemote.resumeUserIdle()
        }
      }}
    >
      <Popover.Trigger asChild>
        <button
          className="group pointer-events-auto flex cursor-pointer items-center justify-center hover:text-accent hover:bg-primary aspect-square w-12 rounded-md duration-200 focus:bg-primary video-control"
          aria-label="Volumes"
        >
          <SpeakerSimpleHigh weight="fill" className="h-6 w-6 duration-300" />
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          className="flex w-64 items-center rounded-md bg-primary px-4 py-2 backdrop-blur-md"
          sideOffset={6}
          side="right"
          align="center"
        >
          <Slider.Root
            className="relative flex h-5 w-[200px] touch-none select-none items-center overflow-hidden rounded-md"
            defaultValue={[volume * 100]}
            max={100}
            step={1}
            aria-label="Volume"
            onValueChange={(value) => {
              debounceVolume(value[0] / 100)
            }}
          >
            <Slider.Track className="relative h-3 grow rounded-md bg-tertiary">
              <Slider.Range className="absolute h-full bg-accent" />
            </Slider.Track>
            <Slider.Thumb className="block h-4 w-4 rounded bg-subtle transition-all duration-200 focus:outline-none" />
          </Slider.Root>
          <span className="ml-3 text-xs text-white w-6 text-center">{Math.round(volume * 100)}%</span>
          <Popover.Arrow className="fill-primary " />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}
