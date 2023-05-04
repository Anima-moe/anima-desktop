import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import clsx from 'clsx'
import { motion } from 'framer-motion'
import { useAtom } from 'jotai'
import { ArrowLeft, Chat } from 'phosphor-react'

import { playerStreamConfig, playerConfigPage, playerAvailableHeights } from '@/stores/atoms'
import { useMediaPlayer } from '@vidstack/react'

const _qualityTags = {
  1080: 'FHD',
  720: 'HD',
  480: 'SD',
  360: 'LD',
  240: 'SLD',
}

function Qualities() {
  const [streamConfig, setStreamConfig] = useAtom(playerStreamConfig)
  const [availableHeights] = useAtom(playerAvailableHeights)
  const [configPage, setConfigPage] = useAtom(playerConfigPage)
  const mediaPlayer = useMediaPlayer()
  const { t } = useTranslation()

  const classNames = clsx({
    'flex flex-row py-2 px-2 duration-300 rounded-md mb-2 justify-between group cursor-pointer':
      true,
    'cursor-not-allowed bg-tertiary': streamConfig.streamHeight === 0 || !streamConfig.streamHeight,
    'hover:bg-accent hover:text-primary': streamConfig.streamHeight !== 0,
  })


  return (
    <motion.div
      initial={{ x: 50 }}
      animate={{ x: 0 }}
      exit={{ x: 50 }}
      className="relative w-full h-full overflow-hidden "
    >
      <div
        className="flex flex-row items-center justify-between p-2 rounded-md cursor-pointer pointer-events-auto group hover:bg-tertiary hover:text-white"
        onClick={() => {
          setConfigPage('main')
        }}
      >
        <ArrowLeft />
        <span className="flex flex-row items-center text-sm text-subtle">
          {t('anime.settings.qualities')}
          <Chat className="ml-1.5" />
        </span>
      </div>
      <hr className="my-2 mb-2 border-tertiary" />
      <div className="max-h-[calc(100vh-16rem)] overflow-y-auto">
        <div
          className={classNames + ' mt-2'}
          onClick={() => {
            if (streamConfig.streamHeight === -1) return

            setStreamConfig({
              ...streamConfig,
              streamHeight: -1,
            })
          }}
        >
          <span className="">Auto</span>
          <span className="ml-8 rounded bg-accent px-2 py-1 text-[.75rem] text-primary group-hover:bg-black group-hover:text-accent">
            A
          </span>
        </div>
        {availableHeights.map((quality, index) => {
          const classNames = clsx({
            'flex flex-row py-2 px-2 duration-300 rounded-md mb-2 last:mb-0 justify-between group cursor-pointer':
              true,
            'cursor-not-allowed bg-tertiary': streamConfig.streamHeight === quality.height,
            'hover:bg-accent hover:text-primary': streamConfig.streamHeight !== quality.height,
          })

          return (
            <div
              className={classNames}
              key={`qual-${index}.${quality.height}`}
              onClick={() => {
                if (streamConfig.streamHeight === quality.height) return
                setStreamConfig({
                  ...streamConfig,
                  streamHeight: quality.height,
                })
              }}
            >
              <span className="">{quality.height}p</span>
              <span className="ml-8 rounded bg-accent px-2 py-1 text-[.75rem] text-primary group-hover:bg-black group-hover:text-accent">
                {_qualityTags[quality.height]}
              </span>
            </div>
          )
        })}
      </div>
    </motion.div>
  )
}

export default Qualities
