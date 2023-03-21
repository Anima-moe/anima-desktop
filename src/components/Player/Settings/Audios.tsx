import React from 'react'
import { useTranslation } from 'react-i18next'

import clsx from 'clsx'
import { motion } from 'framer-motion'
import { useAtom } from 'jotai'
import { ArrowLeft, MusicNote } from 'phosphor-react'

import { playerStreamConfig, playerConfigPage } from '@/stores/atoms'

type Props = {
  audios: Anima.RAW.StreamObject
}

function Audios({ audios }: Props) {
  const [streamConfig, setStreamConfig] = useAtom(playerStreamConfig)
  const [configPage, setConfigPage] = useAtom(playerConfigPage)
  const { t } = useTranslation()

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
          {t('anime.settings.audios')}
          <MusicNote className="ml-1.5" weight="fill" />
        </span>
      </div>
      <hr className="my-2 mb-2 border-tertiary" />
      <div className="max-h-[calc(100vh-16rem)] overflow-scroll">
        {Object.keys(audios).map((locale, index) => {
          const classNames = clsx({
            'flex flex-row py-2 px-2 duration-300 rounded-md nth-last-of-type:mb-2 justify-between group':
              true,
            'cursor-not-allowed bg-tertiary':
              streamConfig.streamLocale === locale ||
              (streamConfig.streamLocale === '' && locale === 'ja-JP'),
            'cursor-pointer hover:bg-accent hover:text-primary':
              streamConfig.streamLocale !== locale,
          })
          return (
            <div
              className={classNames}
              key={`audio-${index}.${locale}`}
              onClick={() => {
                setStreamConfig({
                  ...streamConfig,
                  streamLocale: locale,
                })
              }}
            >
              <span className="">{t(locale)}</span>
              <span className="ml-8 rounded bg-accent px-2 py-1 text-[.75rem] text-primary group-hover:bg-black group-hover:text-accent">
                {locale}
              </span>
            </div>
          )
        })}
      </div>
    </motion.div>
  )
}

export default Audios
