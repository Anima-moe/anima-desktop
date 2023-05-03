import React from 'react'
import { useTranslation } from 'react-i18next'

import clsx from 'clsx'
import { motion } from 'framer-motion'
import { useAtom } from 'jotai'
import { ArrowLeft, Chat } from 'phosphor-react'

import { playerStreamConfig, playerConfigPage } from '@/stores/atoms'


function SubtitleTypes() {
  const [streamConfig, setStreamConfig] = useAtom(playerStreamConfig)
  const [configPage, setConfigPage] = useAtom(playerConfigPage)
  const { t } = useTranslation()

  const softClassNames = clsx({
    'flex flex-row py-2 px-2 duration-300 rounded-md mb-2 justify-between group cursor-pointer':
      true,
    'cursor-not-allowed bg-tertiary': streamConfig.subtitleMode === 'soft' || !streamConfig.subtitleMode,
    'hover:bg-accent hover:text-primary': streamConfig.subtitleMode !== 'soft',
  })

  const hardClassNames = clsx({
    'flex flex-row py-2 px-2 duration-300 rounded-md mb-2 justify-between group cursor-pointer':
      true,
    'cursor-not-allowed bg-tertiary': streamConfig.subtitleMode === 'hard' || !streamConfig.subtitleMode,
    'hover:bg-accent hover:text-primary': streamConfig.subtitleMode !== 'hard',
  })

  return (
    <motion.div
      initial={{ x: 50 }}
      animate={{ x: 0 }}
      exit={{ x: 50 }}
      className="relative w-full h-full overflow-hidden"
    >
      <div
        className="flex flex-row items-center justify-between p-2 rounded-md cursor-pointer pointer-events-auto group hover:bg-tertiary hover:text-white"
        onClick={() => {
          setConfigPage('main')
        }}
      >
        <ArrowLeft />
        <span className="flex flex-row items-center text-sm text-subtle">
          Subtitle mode
          <Chat className="ml-1.5" />
        </span>
      </div>
      <hr className="my-2 mb-2 border-tertiary" />
      <div className="max-h-[calc(100vh-16rem)] overflow-y-auto">
        <div
          className={hardClassNames + ' mt-2'}
          onClick={() => {
            if (streamConfig.subtitleMode === 'hard') return

            setStreamConfig({
              ...streamConfig,
              subtitleMode: 'hard',
            })
          }}
        >
          <span className="">{t('hard_sub')}</span>
          <span className="ml-8 rounded bg-accent px-2 py-1 text-[.75rem] text-primary group-hover:bg-black group-hover:text-accent">
            N/a
          </span>
        </div>
            <div
              className={softClassNames}
              onClick={() => {
                if (streamConfig.subtitleMode === 'soft') return
                setStreamConfig({
                  ...streamConfig,
                  subtitleMode: 'soft'
                })
              }}
            >
              <span className="">{t('soft_sub')}</span>
              <span className="ml-8 rounded bg-accent px-2 py-1 text-[.75rem] text-primary group-hover:bg-black group-hover:text-accent">
                ASS/VTT
              </span>
            </div>
      </div>
    </motion.div>
  )
}

export default SubtitleTypes
