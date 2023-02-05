import { motion } from 'framer-motion'
import { ArrowLeft, Chat } from 'phosphor-react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { playerStreamConfig } from '@/stores/atoms'
import { useAtom } from 'jotai'
import clsx from 'clsx'

type Props = {
  subtitles: Anima.RAW.SubtitleObject
}

function Subtitles({ subtitles }: Props) {
  const [streamConfig, setStreamConfig] = useAtom(playerStreamConfig)
  const { t } = useTranslation()

  const classNames = clsx({
    'flex flex-row py-2 px-2 duration-300 rounded-md mb-2 justify-between group cursor-pointer': true,
    'cursor-not-allowed bg-tertiary' : streamConfig.subLocale === '',
    'hover:bg-accent hover:text-primary': streamConfig.subLocale !== ''
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
          setStreamConfig({
            ...streamConfig,
            configPage: undefined
          })
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
            className={classNames}
            onClick={()=>{
              if (streamConfig.subLocale === '') return
              setStreamConfig({
                ...streamConfig,
                subLocale: '',
                configPage: undefined
              })
            }}
          >
          <span className=''>{t('none')}</span>
          <span className='text-[.75rem] px-2 py-1 bg-accent text-primary rounded ml-8 group-hover:bg-black group-hover:text-accent'>N/a</span>
        </div>
        {Object.keys(subtitles).map((locale, index) => {
          const classNames = clsx({
            'flex flex-row py-2 px-2 duration-300 rounded-md mb-2 justify-between group cursor-pointer': true,
            'cursor-not-allowed bg-tertiary' : streamConfig.subLocale === locale,
            'hover:bg-accent hover:text-primary': streamConfig.subLocale !== locale
          })

          return  <div 
            className={classNames}
            key={`sub-${index}.${locale}`}
            onClick={()=>{
              if (streamConfig.subLocale === locale) return

              setStreamConfig({
                ...streamConfig,
                subLocale: locale,
                configPage: undefined
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