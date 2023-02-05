import { playerStreamConfig } from '@/stores/atoms'
import clsx from 'clsx'
import { motion } from 'framer-motion'
import { useAtom } from 'jotai'
import { ArrowLeft, MusicNote } from 'phosphor-react'
import React from 'react'
import { useTranslation } from 'react-i18next'

type Props = {
  audios: Anima.RAW.StreamObject
}

function Audios({ audios }: Props) {
  const [streamConfig, setStreamConfig] = useAtom(playerStreamConfig)
  const { t } = useTranslation()
  
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
          configPage: undefined,
        })
      }} 
    > 
      <ArrowLeft />
      <span className='flex flex-row items-center text-sm text-subtle'>
        Audios
        <MusicNote className='ml-1.5' weight='fill'/>
      </span>
    </div>
    <hr  className='border-tertiary my-2 mb-2' />
    <div className='max-h-[calc(100vh-16rem)] overflow-scroll'>
      {Object.keys(audios).map((locale, index) => {
        const classNames = clsx({
          'flex flex-row py-2 px-2 duration-300 rounded-md mb-2 justify-between group': true,
          'cursor-not-allowed bg-tertiary' : streamConfig.audioLocale === locale,
          'cursor-pointer hover:bg-accent hover:text-primary': streamConfig.audioLocale !== locale,
        })
        return  <div 
            className={classNames}
            key={`audio-${index}.${locale}`}
            onClick={()=>{
              setStreamConfig({
                ...streamConfig,
                audioLocale: locale,
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

export default Audios