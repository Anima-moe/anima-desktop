import { SpeakerHigh, SpeakerSimpleHigh } from 'phosphor-react'
import { debounce } from 'ts-debounce'

import * as Popover from '@radix-ui/react-popover'
import * as Slider from '@radix-ui/react-slider'
import { useMediaRemote, useMediaStore } from '@vidstack/react'

export default function VolumeControl() {
  const mediaRemote = useMediaRemote()
  const { volume } = useMediaStore()

  const debounceVolume = debounce((value: number) => {
    mediaRemote.changeVolume(value)
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
          className="pointer-events-auto ml-4 cursor-pointer text-white/60"
          aria-label="Update dimensions"
        >
          <SpeakerSimpleHigh weight="fill" className="h-5 w-5 duration-300 group-hover:scale-110" />
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          className="flex w-64 items-center rounded-md bg-secondary/40 px-4 py-2 backdrop-blur-md"
          sideOffset={20}
          side="top"
          align="center"
        >
          <Slider.Root
            className="relative flex h-5 w-[200px] touch-none select-none items-center overflow-hidden rounded-full"
            defaultValue={[volume * 100]}
            max={100}
            step={1}
            aria-label="Volume"
            onValueChange={(value) => {
              debounceVolume(value[0] / 100)
            }}
          >
            <Slider.Track className="relative h-3 grow rounded-full bg-secondary">
              <Slider.Range className="absolute h-full bg-accent" />
            </Slider.Track>
            <Slider.Thumb className="block h-5 w-5 rounded-[10px] bg-accent transition-all duration-200 focus:outline-none" />
          </Slider.Root>
          <span className="ml-3 text-xs text-white">{Math.round(volume * 100)}%</span>
          <Popover.Arrow className="fill-secondary/40 " />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}
