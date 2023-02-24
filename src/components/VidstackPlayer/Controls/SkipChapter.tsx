import { useEffect, useState } from 'react'

import axios from 'axios'
import { ArrowRight, X } from 'phosphor-react'

import { anilistService } from '@/services/anilist/anilistService'
import { Anime } from '@/services/anima/anime'
import { useMediaPlayer, useMediaRemote, useMediaStore } from '@vidstack/react'

export interface ISkipOpeningProps {
  animeID: number
  episodeNumber: number
}

type AniSkipResult = {
  found?: boolean
  results?: {
    interval: {
      startTime: number
      endTime: number
      skipId: string
      episodeLength: number
    }
    skipType: 'op' | 'ed' | 'recap'
  }[]
}

const fetchSkipOpening = async (malID: number, episodeNumber: number, episodeLength?: number) => {
  if (!episodeLength) {
    return
  }
  const aniskip = await axios.get(
    `https://api.aniskip.com/v2/skip-times/${malID}/${episodeNumber}/?episodeLength=${episodeLength}&types=op&types=ed&types=recap`
  )
  return aniskip.data as AniSkipResult
}

export function SkipChapter({ animeID, episodeNumber }: ISkipOpeningProps) {
  const [skipData, setSkipData] = useState<AniSkipResult | undefined>()
  const { duration, currentTime, played } = useMediaStore()
  const [forceHide, setForceHide] = useState(false)
  const useRemote = useMediaRemote()

  useEffect(() => {
    if (!animeID || !episodeNumber) {
      return
    }

    ;(async () => {
      try {
        const animeData = await Anime.get(animeID)
        if (!animeData?.data) {
          return
        }
        const anilistData = await anilistService.getAnimeByName(animeData.data.AnimeMetadata[0].title)
        if (!anilistData) {
          return
        }
        const skipOpeningData = await fetchSkipOpening(
          anilistData.idMal,
          episodeNumber,
          Math.round(duration)
        )
        if (!skipOpeningData?.results) {
          return
        }
        setSkipData(skipOpeningData)
      } catch (e) {}
    })()
  }, [animeID, episodeNumber, duration])

  if (forceHide || !duration || duration === 0) {
    return <> </>
  }

  const getOpening = () => {
    if (!skipData || !skipData?.results) {
      return
    }

    return skipData?.results?.filter((result) => {
      return result.skipType === 'op'
    })?.[0]
  }

  const getEnding = () => {
    if (!skipData || !skipData?.results) {
      return
    }

    return skipData?.results.filter((result) => {
      return result.skipType === 'ed'
    })?.[0]
  }

  const shouldDisplay = () => {
    if (!getOpening() && !getEnding()) {
      return false
    }

    if (
      currentTime >= getOpening()?.interval?.startTime &&
      currentTime + 1 <= getOpening()?.interval?.endTime
    ) {
      return {
        skipType: 'op',
      }
    }
    if (
      currentTime >= getEnding()?.interval?.startTime &&
      currentTime + 1 <= getEnding()?.interval?.endTime
    ) {
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

  function getIntroPercentage() {
    if (!display) { return }

    if (display.skipType === 'op') {
      return Math.round((1 - (getOpening().interval.endTime - currentTime) / 100) * 100)
    }
    
    if (display.skipType === 'ed') {
      return  Math.round((1 - (getEnding().interval.endTime - currentTime) / 100) * 100)
    }
  }

  if (played && display)
    return (
      <div
        className="group pointer-events-auto absolute bottom-20 right-4 ml-auto w-min cursor-pointer select-none overflow-hidden whitespace-nowrap rounded-md bg-secondary px-2 py-2 text-lg"
        onClick={() => {
          useRemote.seek(
            display.skipType === 'op' ? getOpening().interval.endTime : getEnding().interval.endTime
          )
        }}
      >
        <div
          className={
            'absolute top-0 left-0 h-full bg-white transition-all duration-300 group-hover:bg-accent'
          }
          style={{ width: `${getIntroPercentage()}%`, content: `${getIntroPercentage()}` }}
        />

        <span className="flex items-center text-white mix-blend-difference">
          {display.skipType === 'op'
            ? 'Skip Opening'
            : display.skipType === 'ep'
            ? 'Skip Episode'
            : 'Skip Ending'}
          <ArrowRight className="ml-3" />
        </span>
      </div>
    )

  if (played && !skipData && currentTime < 60 * 3)
    return <div className='absolute bottom-20 right-6'>
      <div
        className="relative group pointer-events-auto ml-auto w-min cursor-pointer select-none overflow-hidden whitespace-nowrap rounded-md bg-secondary px-2 py-2 text-lg"
        onClick={() => {
          useRemote.seek(currentTime + 86)
          setForceHide(true)
        }}
        
        onContextMenu={(e) => {
          e.preventDefault()
          setForceHide(true)
        }}
      >
        <div
          className={
            'absolute top-0 left-0 h-full bg-white transition-all duration-300 group-hover:bg-accent'
          }
          style={{
            width: `${Math.round((1 - (86 - currentTime) / 100) * 100)}%`,
          }}
        />

        <span className="flex items-center text-white mix-blend-difference">
          {'Skip generic intro +1:30'}
          <ArrowRight className="ml-3" />
        </span>
      </div>
    </div>
}
