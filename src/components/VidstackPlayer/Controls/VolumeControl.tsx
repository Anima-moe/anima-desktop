import { SpeakerHigh, SpeakerSimpleHigh } from 'phosphor-react'
import {debounce} from 'ts-debounce'

import * as Popover from '@radix-ui/react-popover'
import * as Slider from '@radix-ui/react-slider'
import { useMediaRemote, useMediaStore } from '@vidstack/react'

export default function VolumeControl () {
  const mediaRemote = useMediaRemote()
  const {volume} = useMediaStore()

  const debounceVolume = debounce((value: number) => {
    mediaRemote.changeVolume(value)
  }, 150)
  
  return   <Popover.Root onOpenChange={(o)=>{
    if (o) {
      mediaRemote.pauseUserIdle()
    } else {
      mediaRemote.resumeUserIdle()
    }
  }}>
  <Popover.Trigger asChild>
    <button className="cursor-pointer ml-4 pointer-events-auto text-white/60" aria-label="Update dimensions">
      <SpeakerSimpleHigh weight='fill' className='w-5 h-5 group-hover:scale-110 duration-300'/>
    </button>
  </Popover.Trigger>
  <Popover.Portal>
    <Popover.Content className="bg-secondary/40 backdrop-blur-md px-4 py-2 rounded-md flex items-center w-64" sideOffset={20} side='top' align='center'>
      <Slider.Root
        className="relative flex items-center select-none touch-none w-[200px] h-5 overflow-hidden rounded-full"
        defaultValue={[volume*100]}
        max={100}
        step={1}
        aria-label="Volume"
        onValueChange={(value) => {
          debounceVolume(value[0] / 100)
        }}
      >
        <Slider.Track className="bg-secondary relative grow rounded-full h-3">
          <Slider.Range className="absolute bg-accent h-full" />
        </Slider.Track>
        <Slider.Thumb className="block w-5 h-5 bg-accent rounded-[10px] focus:outline-none transition-all duration-200" />
      </Slider.Root>
      <span className='ml-3 text-xs text-white'>{Math.round(volume*100)}%</span>
      <Popover.Arrow className="fill-secondary/40 " />
    </Popover.Content>
  </Popover.Portal>
</Popover.Root>

}
