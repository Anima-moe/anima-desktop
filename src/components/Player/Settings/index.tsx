// import { Popover, Transition } from '@headlessui/react'
// import { Gear } from 'phosphor-react'
import * as Popover from '@radix-ui/react-popover'
import { AnimatePresence, motion } from 'framer-motion'
import { CaretRight, Chat, Gear, MusicNote } from 'phosphor-react'
import Subtitles from './Subtitles'
import { playerStreamConfig, playerConfigPage } from '@/stores/atoms'
import { useAtom } from 'jotai'
import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react';
import SettingEntry from './SettingEntry'
import Audios from './Audios'
import { useMediaRemote } from '@vidstack/react';

type Props = {
  audios: Anima.RAW.StreamObject
  subtitles: Anima.RAW.SubtitleObject
}

function index({audios, subtitles}: Props) {
  const [configPage, setConfigPage] = useAtom(playerConfigPage)
  const [streamConfig, setStreamConfig] = useAtom(playerStreamConfig)
  const mediaRemote = useMediaRemote()
  const { t } = useTranslation()


  return <Popover.Root onOpenChange={(o)=>{
    if (o) {
      mediaRemote.pauseUserIdle()
    } else {
      mediaRemote.resumeUserIdle()
    }
  }}>
    <Popover.Trigger asChild>
      <button className={`
          ml-1.5
          cursor-pointer border hover:text-accent hover:bg-black duration-300 px-3 py-3 rounded-md
         active:bg-accent active:text-primary active:border-accent bg-transparent border-transparent text-white pointer-events-auto`} aria-label="Update dimensions">
        <Gear weight="fill" size={24}/>
      </button>
    </Popover.Trigger>
    <Popover.Portal>
      <Popover.Content sideOffset={2}  className='overflow-hidden select-none'>
        <div 
          className="bg-secondary rounded-md pt-2 px-2 transition-[height] w-max h-max border border-tertiary min-w-[14rem] relative 'overflow-hidden"
        >
          <AnimatePresence mode='wait' initial={false}>
            {configPage === 'audio' && <Audios audios={audios} />}
            {configPage === 'subtitle' && <Subtitles subtitles={subtitles} />}
            {configPage === 'main' && <motion.div 
                className='flex flex-col w-full pb-2 cursor-pointer'
                initial={{ x: -50 }}
                animate={{ x: 0 }}
                exit={{ x: -50 }}
              > 
              <SettingEntry LeftIcon={MusicNote} page='audio' text='Audio' value={streamConfig.streamLocale || 'ja-JP'} />
              <SettingEntry LeftIcon={Chat} page='subtitle' text='Subtitle' value={streamConfig.subtitleLocale || 'N/a'} />
            </motion.div>}
          </AnimatePresence>
        </div>
        <Popover.Arrow className="text-secondary fill-secondary stroke-tertiary" />
      </Popover.Content>
    </Popover.Portal>
  </Popover.Root>
}

export default index