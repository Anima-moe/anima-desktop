// import { Popover, Transition } from '@headlessui/react'
// import { Gear } from 'phosphor-react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { AnimatePresence, motion } from 'framer-motion'
import { useAtom } from 'jotai'
import { CaretRight, Chat, ChatsCircle, Gear, MusicNote, Sliders } from 'phosphor-react'

import { playerStreamConfig, playerConfigPage } from '@/stores/atoms'
import * as Popover from '@radix-ui/react-popover'
import { useMediaRemote } from '@vidstack/react'

import Audios from './Audios'
import Qualities from './Qualities'
import SettingEntry from './SettingEntry'
import Subtitles from './Subtitles'
// import SubtitleTypes from './SubtitleTypes'

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
          setConfigPage('main')
        }
      }}
    >
      <Popover.Trigger asChild>
        <button
          className={`
          pointer-events-auto
          cursor-pointer rounded-md border border-transparent bg-transparent px-2 py-2
         text-white duration-300 hover:bg-black hover:text-accent active:border-accent active:bg-accent active:text-primary video-control`}
          aria-label="Update dimensions"
        >
          <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" className='w-6 y-6'>
            <path d="M18.6669 10.4001C18.6669 10.7683 18.3684 11.0667 18.0002 11.0667H16.2668C15.8987 11.0667 15.6002 10.7683 15.6002 10.4001V9.86674C15.6002 9.7931 15.5405 9.73341 15.4669 9.73341H5.99998C5.63179 9.73341 5.33331 9.43493 5.33331 9.06674V7.33341C5.33331 6.96522 5.63179 6.66674 5.99998 6.66674H15.4669C15.5405 6.66674 15.6002 6.60704 15.6002 6.53341V6.00007C15.6002 5.63188 15.8987 5.3334 16.2668 5.3334H18.0002C18.3684 5.3334 18.6669 5.63188 18.6669 6.00007V10.4001Z" fill="currentColor" />
            <path d="M11.3334 18.8668C11.7016 18.8668 12.0001 18.5683 12.0001 18.2001V13.8001C12.0001 13.4319 11.7016 13.1335 11.3334 13.1335H9.60006C9.23187 13.1335 8.93339 13.4319 8.93339 13.8001V14.3335C8.93339 14.4071 8.8737 14.4668 8.80006 14.4668H6.00006C5.63187 14.4668 5.33339 14.7653 5.33339 15.1335V16.8668C5.33339 17.235 5.63187 17.5335 6.00006 17.5335H8.80006C8.8737 17.5335 8.93339 17.5932 8.93339 17.6668V18.2001C8.93339 18.5683 9.23187 18.8668 9.60006 18.8668H11.3334Z" fill="currentColor" />
            <path d="M18.6667 26.0001C18.6667 26.3683 18.3682 26.6668 18 26.6668H16.2667C15.8985 26.6668 15.6 26.3683 15.6 26.0001V25.4668C15.6 25.3931 15.5403 25.3334 15.4667 25.3334H6.00014C5.63195 25.3334 5.33348 25.0349 5.33348 24.6668V22.9334C5.33348 22.5652 5.63195 22.2668 6.00014 22.2668H15.4667C15.5403 22.2668 15.6 22.2071 15.6 22.1334V21.6001C15.6 21.2319 15.8985 20.9334 16.2667 20.9334H18C18.3682 20.9334 18.6667 21.2319 18.6667 21.6001V26.0001Z" fill="currentColor" />
            <path d="M22 24.6668C22 25.0349 22.2985 25.3334 22.6667 25.3334H26.0001C26.3683 25.3334 26.6668 25.0349 26.6668 24.6668V22.9334C26.6668 22.5652 26.3683 22.2668 26.0001 22.2668H22.6667C22.2985 22.2668 22 22.5652 22 22.9334V24.6668Z" fill="currentColor" />
            <path d="M16.0001 17.5335C15.6319 17.5335 15.3334 17.235 15.3334 16.8668V15.1335C15.3334 14.7653 15.6319 14.4668 16.0001 14.4668H26.0001C26.3683 14.4668 26.6667 14.7653 26.6667 15.1335V16.8668C26.6667 17.235 26.3683 17.5335 26.0001 17.5335H16.0001Z" fill="currentColor" />
            <path d="M22.0002 9.06674C22.0002 9.43493 22.2987 9.73341 22.6669 9.73341H26C26.3682 9.73341 26.6666 9.43493 26.6666 9.06674V7.3334C26.6666 6.96521 26.3682 6.66674 26 6.66674H22.6669C22.2987 6.66674 22.0002 6.96522 22.0002 7.33341V9.06674Z" fill="currentColor" />
          </svg>
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content sideOffset={2} align="end" className="overflow-hidden select-none">
          <div className="'overflow-hidden relative h-max w-max min-w-[16rem] rounded-md border border-tertiary bg-secondary px-2 pt-2 transition-[height]">
            <AnimatePresence mode="wait" initial={false}>
              {configPage === 'audio' && <Audios audios={audios} />}
              {configPage === 'subtitle' && <Subtitles subtitles={subtitles} />}
              {configPage === 'quality' && <Qualities />}
              {/* {configPage === 'subType' && <SubtitleTypes />} */}
              {configPage === 'main' && (
                <motion.div
                  className="flex flex-col w-full pb-2 cursor-pointer"
                  initial={{ x: -50 }}
                  animate={{ x: 0 }}
                  exit={{ x: -50 }}
                >
                  <SettingEntry
                    LeftIcon={Sliders}
                    page="quality"
                    text={t('anime.settings.quality')}
                    value={(streamConfig.streamHeight > 0) ? streamConfig.streamHeight.toString() + 'p' : 'Auto'}
                  />
                  <SettingEntry
                    LeftIcon={MusicNote}
                    page="audio"
                    text={t('anime.settings.audio')}
                    value={streamConfig.streamLocale || 'ja-JP'}
                  />
                  <SettingEntry
                    LeftIcon={Chat}
                    page="subtitle"
                    text={t('anime.settings.subtitle')}
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
