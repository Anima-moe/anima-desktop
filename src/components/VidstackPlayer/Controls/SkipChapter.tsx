import { useEffect, useState } from 'react'

import axios from 'axios'
import { ArrowRight } from 'phosphor-react'

import { anilistService } from '@/services/anilist/anilistService'
import { Anime } from '@/services/anima/anime'
import { useMediaPlayer, useMediaRemote, useMediaStore } from '@vidstack/react'

export interface ISkipOpeningProps {
  animeID: number
  episodeNumber: number
}

type AniSkipResult =  {
    found?: boolean,
    results?: {
      interval: {
        startTime: number,
        endTime: number,
        skipId: string,
        episodeLength: number,
      }
      skipType: 'op' | 'ed' | 'recap'
    }[]
}

const fetchSkipOpening = async (malID: number, episodeNumber: number, episodeLength?:number) => {
  if (!episodeLength) { return }
  const aniskip = await axios.get(`https://api.aniskip.com/v2/skip-times/${malID}/${episodeNumber}/?episodeLength=${episodeLength}&types=op&types=ed&types=recap`)
  return aniskip.data as AniSkipResult
}

export function SkipChapter (props: ISkipOpeningProps) {
  const [skipData, setSkipData] = useState<AniSkipResult | undefined>()
  const {duration, currentTime} = useMediaStore()
  const useRemote = useMediaRemote()
  
  useEffect(()=>{
    if (!props.animeID || !props.episodeNumber) { return }
    (async()=>{
      const animeData = await Anime.get(props.animeID)
      if (!animeData?.data) { return }
      const anilistData = await anilistService.getAnimeByName(animeData.data.AnimeMetadata[0].title)
      if (!anilistData) { return }
      const skipOpeningData = await fetchSkipOpening(anilistData.idMal, props.episodeNumber, Math.round(duration))
      if (!skipOpeningData?.results) { return }
      setSkipData(skipOpeningData)
    })()
  }, [props.animeID, props.episodeNumber])

  // TODO: Make default 1:30 episode skip

  if (!skipData) { return <> </>}

  const getOpening = () => {
    if (!skipData?.results) { return  }

    return skipData.results.filter(result => {
      return result.skipType === 'op'
    })?.[0]
  
  }

  const getEnding = () => {
    if (!skipData?.results) { return  }

    return skipData?.results.filter( result => {
      return result.skipType === 'ed'
    })?.[0]
  }

  const shouldDisplay = () => {
    if ((currentTime >= getOpening().interval.startTime && currentTime + 1 <= getOpening().interval.endTime) ) {
      return {
        skipType: 'op',
      }
    } 
    if ((currentTime >= getEnding().interval.startTime && currentTime + 1 <= getEnding().interval.endTime)) {
      return {
        skipType: 'ed',
      }
    }
    if (currentTime + 1 >= duration) {
      return {
        skipType: 'ep',
      }
    }
  }

  const display = shouldDisplay()

  if (display) return (
    <div 
      className='bg-secondary rounded-md px-6 w-min whitespace-nowrap py-4 absolute ml-auto bottom-20 right-6 text-lg cursor-pointer group pointer-events-auto overflow-hidden select-none'
      onClick={()=>{ 
        useRemote.seek(display.skipType === 'op' ? getOpening().interval.endTime : getEnding().interval.endTime) }}
    >
      <div className={'h-full absolute top-0 left-0 bg-white group-hover:bg-accent transition-all duration-300'} style={{ width: `
        ${display.skipType === 'op' 
              ? (1 - (getOpening().interval.endTime - currentTime) / 100) * 100
              : (1 - (getEnding().interval.endTime - currentTime) / 100) * 100
        }%`
      }}/>
      
      <span className='mix-blend-difference text-white flex items-center'>
        {display.skipType === 'op' 
          ? 'Skip Opening' 
          : display.skipType === 'ep'
            ? 'Skip Episode'
            : 'Skip Ending'
        }
        <ArrowRight className='ml-3' />
      </span>
    </div>
  )
}
