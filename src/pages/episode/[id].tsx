import { createRef, useEffect, useState } from 'react'
import { useQuery } from 'react-query'

import i18next from 'i18next'
import { useAtom } from 'jotai'
import { useRouter } from 'next/router'
import type { MediaPlayerElement } from 'vidstack'

import StreamError from '@/components/Error/StreamError'
import MediaLayout from '@/components/Layout/Media'
import Player from '@/components/VidstackPlayer'
import StreamLoading from '@/components/VidstackPlayer/Displays/StreamLoading'
import SourceController from '@/components/VidstackPlayer/sourceController'
import SutbtitleController from '@/components/VidstackPlayer/subtitleController'
import { Episode } from '@/services/anima/episode'
import { getLocaleMetadata } from '@/services/anima/getMetadataFromMedia'
import { Season } from '@/services/anima/season'
import { playerSwitchingStream, userPreferedAudio } from '@/stores/atoms'

import { playerStreamConfig } from '../../stores/atoms'

function fetchStreams(episodeID?: string) {
  if (!episodeID) return
  return Episode.getStreams(Number(episodeID), i18next.language)
}

function fetchEpisode(episodeID?: string) {
  if (!episodeID) return
  return Episode.get(Number(episodeID), i18next.language)
}

function fetchSeason(seasonID?: number) {
  if (!seasonID) return
  return Season.get(Number(seasonID), i18next.language)
}

function Index() {
  const router = useRouter()
  const mediaPlayer = createRef<MediaPlayerElement>()
  const [streamConfig] = useAtom(playerStreamConfig)
  const [sourceController, defineSourceController] = useState<SourceController>()
  const [subtitleController, defineSubtitleController] = useState<SutbtitleController>()
  const [switchingStream, setSwitchingStream] = useAtom(playerSwitchingStream)
  const {
    data: episodeData,
    isLoading: episodeLoading,
    error: episodeError,
  } = useQuery(`/api/episode/${router.query.id}`, () => fetchEpisode(router.query.id as string), {
    cacheTime: 0,
    retry: 3,
    refetchOnWindowFocus: false,
  })
  const {
    data: seasonData,
    isLoading: seasonLoading,
    error: seasonError,
  } = useQuery(
    `/api/season/${episodeData?.data?.season_id}`,
    () => fetchSeason(episodeData?.data?.season_id),
    {
      cacheTime: 0,
      retry: 3,
      refetchOnWindowFocus: false,
    }
  )
  const {
    data: streamData,
    isLoading: streamLoading,
    error: streamError,
  } = useQuery(
    `/api/episode/${router.query.id}/streams`,
    () => fetchStreams(router.query.id as string),
    {
      cacheTime: 0,
      retry: 3,
      refetchOnWindowFocus: false,
    }
  )

  useEffect(() => {
    if (!router.isReady) {
      return
    }
    if (!streamData || !seasonData || !episodeData) {
      return
    }
    if (!mediaPlayer.current) {
      return
    }

    defineSourceController(
      new SourceController(mediaPlayer.current, streamData.data, episodeData.data)
    )
    defineSubtitleController(new SutbtitleController(mediaPlayer.current, streamData.data))
  }, [router, episodeLoading, seasonLoading, streamLoading, mediaPlayer.current])

  // Listen for stream changes
  useEffect(() => {
    if (!router.isReady) {
      return
    }
    if (!streamConfig.streamURL) {
      return
    }
    if (!sourceController) {
      return
    }
    sourceController.requestAudioChange(streamConfig.streamLocale)
  }, [router.query.id, streamConfig.streamLocale])

  // Listen for request to change subtitle locale
  useEffect(() => {
    if (!router.isReady) {
      return
    }
    if (!subtitleController) {
      return
    }

    subtitleController.requestSubtitleChange(streamConfig.subtitleLocale)
  }, [router.isReady, subtitleController, streamConfig.subtitleLocale])

  if (streamLoading || seasonLoading || episodeLoading) {
    return <StreamLoading background={episodeData?.data?.thumbnail} />
  }

  if (
    !episodeData ||
    !seasonData ||
    !streamData ||
    episodeError ||
    seasonError ||
    streamError ||
    streamData.count < 1
  )
    return (
      <StreamError
        error={`.report ${btoa(
          JSON.stringify({
            episode: episodeData?.data?.id,
            season: episodeData?.data?.season_id,
            anime: seasonData?.data?.[0]?.anime_id,
            source: episodeData?.data?.source_id,
            localizedTitle: getLocaleMetadata<Anima.RAW.Episode, Anima.RAW.EpisodeMetadata>(
              episodeData?.data
            )?.title,
            message: `${episodeError || seasonError || streamError || 'STREAM NOT FOUND'}`,
          })
        )}`}
      />
    )

  return (
    <MediaLayout>
      {streamData && (
        <Player
          episodeData={episodeData.data}
          seasonData={seasonData?.data[0]}
          ref={mediaPlayer}
          streamData={streamData.data}
          onCanLoad={() => {}}
          onSourceChange={(source) => {}}
        />
      )}
    </MediaLayout>
  )
}

export default Index
