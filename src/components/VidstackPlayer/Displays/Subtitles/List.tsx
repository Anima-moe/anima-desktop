import React, { memo, useEffect, useMemo, useState } from 'react'
import { useQuery } from 'react-query'

import axios from 'axios'
import { useAtom } from 'jotai'
import { parseSync } from 'subtitle'

import { playerStreamConfig } from '@/stores/atoms'
import { useMediaStore } from '@vidstack/react'

import Caption from './Caption'
import { getFormat } from './Time'


function getFormatFromList(captions) {
  if (!captions.length) return 'mm:ss'
  return getFormat(captions[captions.length - 1].end)
}

function shouldDisplayCaption(caption, currentTime) {
  if (!caption?.text) { return false }
  return ( (caption.start <= currentTime * 1000) && (caption.end > currentTime * 1000) )
}

function shouldUseEnd(end, index, captions) {
  const nextCaption = captions[index + 1]
  if (!nextCaption) {
    return false // The end of the video
  }
  return end !== nextCaption.start && end + 1 !== nextCaption.start
}

export default memo(function Captions() {
  const {currentTime, duration} = useMediaStore()
  const [streamConfig] = useAtom(playerStreamConfig)
  const { data, error, isLoading } = useQuery(`subtitles/${streamConfig.subtitleURL}.${streamConfig.streamLocale}`, ()=> { return axios.get(streamConfig.subtitleURL).then(g => g.data ) })

  const captions = useMemo(()=> {
    if ((!streamConfig.streamLocale || streamConfig.subtitleURL === '')) {
      return []
    }
    if (isLoading || error || !data) {
      return []
    }
    return parseSync(data)
  }, [data])

  const textLine = useMemo(()=>{
    if (!captions) { return }

    const currentCaption = captions.find(caption => shouldDisplayCaption(caption.data, currentTime))
    if (shouldDisplayCaption(currentCaption?.data, currentTime)) {
      return currentCaption
    } else {
      return null
    }
  }, [captions, currentTime.toFixed(1)])

  if (!streamConfig.streamLocale || streamConfig.subtitleURL === '') {
    return <></>
  }

  if (isLoading || error || !data) {
    return <></>
  }


  const format = getFormatFromList(captions)

  return (
    <div className="z-[50] w-full absolute bottom-24 media-user-idle:bottom-10 flex items-center justify-end text-3xl duration-300 transition-all flex-col">
      {/* @ts-ignore-error |  */}
      { textLine && <Caption text={textLine.data.text} /> }
    </div>
  )
})