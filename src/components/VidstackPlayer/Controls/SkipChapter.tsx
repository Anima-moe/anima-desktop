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

export function SkipChapter(props: ISkipOpeningProps) {
  const [skipData, setSkipData] = useState<AniSkipResult | undefined>()
  const { duration, currentTime } = useMediaStore()
  const useRemote = useMediaRemote()

  useEffect(() => {
    if (!props.animeID || !props.episodeNumber) {
      return
    }
    ;(async () => {
      const animeData = await Anime.get(props.animeID)
      if (!animeData?.data) {
        return
      }
      const anilistData = await anilistService.getAnimeByName(animeData.data.AnimeMetadata[0].title)
      if (!anilistData) {
        return
      }
      const skipOpeningData = await fetchSkipOpening(
        anilistData.idMal,
        props.episodeNumber,
        Math.round(duration)
      )
      if (!skipOpeningData?.results) {
        return
      }
      setSkipData(skipOpeningData)
    })()
  }, [props.animeID, props.episodeNumber])

  // TODO: Make default 1:30 episode skip

  if (!skipData) {
    return <> </>
  }

  const getOpening = () => {
    if (!skipData?.results) {
      return
    }

    return skipData.results.filter((result) => {
      return result.skipType === 'op'
    })?.[0]
  }

  const getEnding = () => {
    if (!skipData?.results) {
      return
    }

    return skipData?.results.filter((result) => {
      return result.skipType === 'ed'
    })?.[0]
  }

  const shouldDisplay = () => {
    if (
      currentTime >= getOpening().interval.startTime &&
      currentTime + 1 <= getOpening().interval.endTime
    ) {
      return {
        skipType: 'op',
      }
    }
    if (
      currentTime >= getEnding().interval.startTime &&
      currentTime + 1 <= getEnding().interval.endTime
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

  if (display)
    return (
      <div
        className="group pointer-events-auto absolute bottom-20 right-6 ml-auto w-min cursor-pointer select-none overflow-hidden whitespace-nowrap rounded-md bg-secondary px-6 py-4 text-lg"
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
          style={{
            width: `
        ${
          display.skipType === 'op'
            ? (1 - (getOpening().interval.endTime - currentTime) / 100) * 100
            : (1 - (getEnding().interval.endTime - currentTime) / 100) * 100
        }%`,
          }}
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
}
