// import { Popover, Transition } from '@headlessui/react'
// import { Gear } from 'phosphor-react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { AnimatePresence, motion } from 'framer-motion'
import { useAtom } from 'jotai'
import { CaretRight, Chat, Gear, MusicNote, Sliders } from 'phosphor-react'

import { playerStreamConfig, playerConfigPage } from '@/stores/atoms'
import * as Popover from '@radix-ui/react-popover'
import { useMediaRemote } from '@vidstack/react'

import Audios from './Audios'
import Qualities from './Qualities'
import SettingEntry from './SettingEntry'
import Subtitles from './Subtitles'

type Props = {
  audios: Anima.RAW.StreamObject
  subtitles: Anima.RAW.SubtitleObject
}

function Index({ audios, subtitles }: Props) {
  const [configPage, setConfigPage] = useAtom(playerConfigPage)
  const [streamConfig, setStreamConfig] = useAtom(playerStreamConfig)
  const mediaRemote = useMediaRemote()
  const { t } = useTranslation()

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
          className={`
          pointer-events-auto
          ml-1.5 cursor-pointer rounded-md border border-transparent bg-transparent px-3 py-3
         text-white duration-300 hover:bg-black hover:text-accent active:border-accent active:bg-accent active:text-primary video-control`}
          aria-label="Update dimensions"
        >
          <Gear weight="fill" size={24} />
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content sideOffset={2} align="end" className="select-none overflow-hidden">
          <div className="'overflow-hidden relative h-max w-max min-w-[14rem] rounded-md border border-tertiary bg-secondary px-2 pt-2 transition-[height]">
            <AnimatePresence mode="wait" initial={false}>
              {configPage === 'audio' && <Audios audios={audios} />}
              {configPage === 'subtitle' && <Subtitles subtitles={subtitles} />}
              {configPage === 'quality' && <Qualities />}
              {configPage === 'main' && (
                <motion.div
                  className="flex w-full cursor-pointer flex-col pb-2"
                  initial={{ x: -50 }}
                  animate={{ x: 0 }}
                  exit={{ x: -50 }}
                >
                  <SettingEntry
                    LeftIcon={Sliders}
                    page="quality"
                    text="Quality"
                    value={(streamConfig.streamHeight > 0) ? streamConfig.streamHeight.toString() : 'Auto'}
                  />
                  <SettingEntry
                    LeftIcon={MusicNote}
                    page="audio"
                    text="Audio"
                    value={streamConfig.streamLocale || 'ja-JP'}
                  />
                  <SettingEntry
                    LeftIcon={Chat}
                    page="subtitle"
                    text="Subtitle"
                    value={streamConfig.subtitleLocale || 'N/a'}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <Popover.Arrow className="fill-secondary stroke-tertiary text-secondary" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}

export default Index
