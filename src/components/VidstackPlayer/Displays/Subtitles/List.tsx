import React, { memo, useMemo } from 'react'
import { useQuery } from 'react-query'
import useSubtitles from 'react-subtitles'

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


  if (!streamConfig.streamLocale || streamConfig.subtitleURL === '') {
    return <></>
  }

  if (isLoading || error || !data) {
    return <></>
  }


  const format = getFormatFromList(captions)

  return (
    <div className="z-[50] w-full absolute bottom-24 media-user-idle:bottom-10 flex items-end justify-center text-3xl duration-300 transition-all">
      {captions.map((captionLine, index) => {
        
        //@ts-expect-error 
        const endToUse = shouldUseEnd(captionLine?.data, index, captions) ? captionLine.data?.end : undefined
          return <div key={index}>
            {(shouldDisplayCaption(captionLine.data, currentTime))  && (
              // @ts-expect-error
              <Caption key={index} end={endToUse} start={captionLine.data?.start} text={captionLine.data?.text} format={format} /> 
            )}
        </div>
      })}
    </div>
  )
})