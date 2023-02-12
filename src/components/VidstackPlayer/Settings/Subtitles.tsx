import React from 'react'
import { useTranslation } from 'react-i18next'

import clsx from 'clsx'
import { motion } from 'framer-motion'
import { useAtom } from 'jotai'
import { ArrowLeft, Chat } from 'phosphor-react'

import { playerStreamConfig, playerConfigPage } from '@/stores/atoms'


type Props = {
  subtitles: Anima.RAW.SubtitleObject
}

function Subtitles({ subtitles }: Props) {
  const [streamConfig, setStreamConfig] = useAtom(playerStreamConfig)
  const [configPage, setConfigPage] = useAtom(playerConfigPage)
  const { t } = useTranslation()

  const classNames = clsx({
    'flex flex-row py-2 px-2 duration-300 rounded-md mb-2 justify-between group cursor-pointer': true,
    'cursor-not-allowed bg-tertiary' : streamConfig.subtitleURL === '' || !streamConfig.subtitleURL,
    'hover:bg-accent hover:text-primary': streamConfig.subtitleURL !== ''
  })

  return (
    <motion.div 
      initial={{ x: 50 }}
      animate={{ x: 0 }}
      exit={{ x: 50 }}
      className='relative overflow-hidden w-full h-full' >
      <div 
        className='flex flex-row p-2 items-center justify-between group hover:bg-tertiary hover:text-white cursor-pointer pointer-events-auto rounded-md'
        onClick={()=>{
          setConfigPage('main')
        }} 
      > 
        <ArrowLeft />
        <span className='flex flex-row items-center text-sm text-subtle'>
          Subtitles
          <Chat className='ml-1.5' />
        </span>
      </div>
      <hr  className='border-tertiary my-2 mb-2' />
      <div className='max-h-[calc(100vh-16rem)] overflow-scroll'>
        <div 
            className={classNames + ' mt-2'}
            onClick={()=>{
              if (streamConfig.subtitleLocale === '') return

              setStreamConfig({
                ...streamConfig,
                subtitleLocale: ''
              })
            }}
          >
          <span className=''>{t('none')}</span>
          <span className='text-[.75rem] px-2 py-1 bg-accent text-primary rounded ml-8 group-hover:bg-black group-hover:text-accent'>N/a</span>
        </div>
        {Object.keys(subtitles).map((locale, index) => {
          const classNames = clsx({
            'flex flex-row py-2 px-2 duration-300 rounded-md mb-2 last:mb-0 justify-between group cursor-pointer': true,
            'cursor-not-allowed bg-tertiary' : streamConfig.subtitleLocale === locale,
            'hover:bg-accent hover:text-primary': streamConfig.subtitleLocale !== locale
          })

          return  <div 
            className={classNames}
            key={`sub-${index}.${locale}`}
            onClick={()=>{
              if (streamConfig.subtitleLocale === locale) return
              setStreamConfig({
                ...streamConfig,
                subtitleLocale: locale
              })
            }}
          >
          <span className=''>{t(locale)}</span>
          <span className='text-[.75rem] px-2 py-1 bg-accent text-primary rounded ml-8 group-hover:bg-black group-hover:text-accent'>{locale}</span>
        </div>
        })}
      </div>
  </motion.div>
  )
}

export default Subtitles