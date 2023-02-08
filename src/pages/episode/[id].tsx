import { useRouter } from 'next/router'

import MediaLayout from '@/components/Layout/Media'
import { Season } from '@/services/anima/season'
import { createRef, useCallback, useEffect, useRef, useState } from 'react'
import Player from '@/components/Player'
import { Episode } from '@/services/anima/episode'
import i18next from 'i18next'
import StreamError from '@/components/Player/Displays/StreamError'
import { useTranslation } from 'react-i18next';
import Loading from '@/components/General/Loading'
import SourceController from '@/components/Player/sourceController'
import SutbtitleController from '@/components/Player/subtitleController'
import type { MediaPlayerElement } from 'vidstack'
import { useAtom } from 'jotai'
import { playerSwitchingStream } from '@/stores/atoms'
import { playerStreamConfig } from '../../stores/atoms';
import StreamLoading from '@/components/Player/Displays/StreamLoading'
import { useQuery } from 'react-query'

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

function index() {
  const router = useRouter()
  const mediaPlayer = createRef<MediaPlayerElement>()
  const [ streamConfig ] = useAtom(playerStreamConfig)
  const [ sourceController, defineSourceController ] = useState<SourceController>()
  const [ subtitleController, defineSubtitleController] = useState<SutbtitleController>()
  const [ switchingStream, setSwitchingStream ] = useAtom(playerSwitchingStream)
  const { data: episodeData, isLoading: episodeLoading, error: episodeError } = useQuery(`/api/episode/${router.query.id}`, () => fetchEpisode(router.query.id as string), { cacheTime: 0 })
  const { data: seasonData, isLoading: seasonLoading, error: seasonError } = useQuery(`/api/season/${episodeData?.data?.season_id}`, () => fetchSeason(episodeData?.data?.season_id), { cacheTime: 0 })
  const { data: streamData, isLoading: streamLoading, error:streamError } = useQuery(`/api/episode/${router.query.id}/streams`, () => fetchStreams(router.query.id as string), { cacheTime: 0 })
  const { t } = useTranslation()

  useEffect(()=>{
    if (!router.isReady) { return }
    if (!streamData || !seasonData || !episodeData) { return }
    if (!mediaPlayer.current) { return }

    defineSourceController( new SourceController(mediaPlayer.current, streamData.data) )
    defineSubtitleController( new SutbtitleController(mediaPlayer.current, streamData.data) )
    
  },[router.query.id, episodeLoading, seasonLoading, streamLoading, mediaPlayer.current])

  // Listen for stream changes
  useEffect(()=>{
    if (!router.isReady) { return }
    if (!streamConfig.streamURL) { return }
    if (!sourceController) { return }

    sourceController.requestAudioChange(streamConfig.streamLocale)
  }, [router.query.id, streamConfig.streamLocale])

  // Listen for request to change subtitle locale
  useEffect(()=>{
    if (!router.isReady) { return }
    if (!subtitleController) { return }

    subtitleController.requestSubtitleChange(streamConfig.subtitleLocale)
  }, [router.isReady, subtitleController, streamConfig.subtitleLocale])

  if (episodeError || seasonError || streamError) return (
    <StreamError 
      error={JSON.stringify({
        animeid: router.query.id,
        message: `${episodeError || seasonError || streamError}`
      })} 
    />
  )

    if(streamLoading || episodeLoading || seasonLoading || !streamConfig.streamURL || !streamData) {
      return <MediaLayout>
        <StreamLoading /> 
      </MediaLayout>
    }

    return <MediaLayout>
      { streamData && streamConfig.streamURL && <Player episodeData={episodeData.data} seasonData={seasonData?.data[0]} ref={mediaPlayer} streamData={streamData.data}/> }
    </MediaLayout>

}

export default index