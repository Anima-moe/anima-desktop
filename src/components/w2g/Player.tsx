import { useEffect } from 'react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'

import i18next from 'i18next'
import { useAtom } from 'jotai'
import { ArrowsClockwise } from 'phosphor-react'
import { MediaPlayerElement } from 'vidstack'

import Loading from '@/components/General/Loading'
import PlayerControls from '@/components/Player/Containers/Controls'
import PlayerControlsRow from '@/components/Player/Containers/Row'
import BackButton from '@/components/Player/Controls/BackButton'
import ExpandButton from '@/components/Player/Controls/ExpandButton'
import FullscreenButton from '@/components/Player/Controls/FullscreenButton'
import PlayButton from '@/components/Player/Controls/PlayButton'
import SeasonBrowser from '@/components/Player/Controls/SeasonBrowser'
import SeekBar from '@/components/Player/Controls/SeekBar'
import SkipButton from '@/components/Player/Controls/SkipButton'
import VolumeBar from '@/components/Player/Controls/VolumeBar'
import SourceDecoder from '@/components/Player/Decoders/Source'
import SubtitleDecoder from '@/components/Player/Decoders/Subtitle'
import PlayerMediaInfo from '@/components/Player/Overlays/MediaState'
import Settings from '@/components/Player/Settings'
import usePresence from '@/hooks/usePresence'
import { Anime } from '@/services/anima/anime'
import { Episode } from '@/services/anima/episode'
import { getLocaleMetadata } from '@/services/anima/getMetadataFromMedia'
import { Season } from '@/services/anima/season'
import { playerStreamConfig, userPreferedAutoplay } from '@/stores/atoms'
import { MediaOutlet, MediaPlayer } from '@vidstack/react'


interface IPlayerProps {
  episodeID: string
  leaderControls?: boolean
  onBack?: () => void
  onReady?: () => void
  onSourceChange?: (source: number) => void
  // animeData: Anima.RAW.Anime,
  // seasonData: Anima.RAW.Season,
  // episodeData: Anima.RAW.Episode,
  // streamData: Anima.RAW.EpisodeStream
}

const queryOptions = {
  refetchOnWindowFocus: false
}

function fetchStreams(episodeID?: string) {
  if (!episodeID) return
  return Episode.getStreams(Number(episodeID))
}

function fetchEpisode(episodeID?: string) {
  if (!episodeID) return
  return Episode.get(Number(episodeID))
}

function fetchSeason(seasonID?: number) {
  if (!seasonID) return
  return Season.get(Number(seasonID), i18next.language)
}

function fetchAnime(animeID?: number) {
  if (!animeID) return
  return Anime.get(Number(animeID))
}

function fetcComments(episodeID: string, skipComments = 0) {
  if (!episodeID) return
  return Episode.getComments(Number(episodeID), skipComments, 10)
}

const Player = React.forwardRef<MediaPlayerElement, IPlayerProps>(({episodeID, leaderControls, onSourceChange, onReady}, ref) => {
  const [streamConfig] = useAtom(playerStreamConfig)
  const { data: episodeData, isLoading: episodeLoading, error: episodeError, } = useQuery(`/api/episode/${episodeID}`, () => fetchEpisode(episodeID), queryOptions)
  const { data: seasonData, isLoading: seasonLoading, error: seasonError, } = useQuery(`/api/season/${episodeData?.data?.season_id}`, () => fetchSeason(episodeData?.data?.season_id), queryOptions)
  const { data: animeData, isLoading: animeLoading, error: animeError, } = useQuery(`/api/anime/${seasonData?.data?.[0]?.anime_id}`, () => fetchAnime(seasonData?.data?.[0].anime_id), queryOptions)
  const { data: streamData, isLoading: streamLoading,error: streamError, } = useQuery(`/api/episode/${episodeID}/streams`, () => fetchStreams(episodeID), queryOptions)
  const { t } = useTranslation()
  const presence = usePresence()

  useEffect(()=>{
    if (!episodeData || !seasonData || !animeData) { return }

    presence.setPresence({
      title: getLocaleMetadata<Anima.RAW.Anime, Anima.RAW.AnimeMetadata>(animeData.data)?.title || 'Unknown title',
      description: `S${seasonData.data[0].number}E${episodeData.data.number}・${getLocaleMetadata<Anima.RAW.Episode, Anima.RAW.EpisodeMetadata>(episodeData.data)?.title || 'Unknown episode title'}`,
      watching: true,
      image: 'logo_play',
      deeplink: `/episode/${episodeData.data.id}`,
      button: t('activity_button_watch')
    })
  }, [episodeData, animeData, seasonData])
  
  if (!episodeData || !seasonData || !animeData || !streamData) return <Loading />
  
  return <>
    <MediaPlayer 
      ref={ref}
      poster={episodeData.data.thumbnail}
      load='custom'
      src={`http://localhost:15411/${btoa(streamConfig.streamURL)}.${streamConfig.streamFormat}`}
      aspectRatio={16/9}
      className='flex bg-secondary w-full relative aspect-video rounded overflow-hidden bg-cover bg-center bg-no-repeat items-center justify-center max-w-[100vw] max-h-[100vh]'
      userIdleDelay={1000}
      onLoadedMetadata={onReady}
    > 
      <MediaOutlet />
      <img src='/i/anima.svg' className='absolute w-32 bottom-4 right-4 opacity-20' />
      <PlayerControls>
        <PlayerControlsRow top>
  
          <SeasonBrowser 
            season={seasonData.data[0]}
            episode={episodeData.data}
            onEpisodeSelect={(ep) => {
              onSourceChange?.(ep.id)
            }}
          />
          <Settings audios={streamData?.data?.audios || {}} subtitles={streamData?.data?.subtitles || {}} />
        </PlayerControlsRow>
        {/* LOAD / BUFFER */}
        <div className='absolute top-0 left-0 hidden w-full h-full pointer-events-none media-buffering:flex media-can-play:hidden media-playing:hidden'>
          <Loading />
        </div>
        <PlayerControlsRow bottom>
          <div className='flex flex-col w-full gap-2'>
            <SeekBar 
              disabled={!leaderControls} 
              animeData={animeData.data} 
              episodeData={episodeData.data} 
              seasonData={seasonData.data[0]} 
              showSkipBar={false}
            />
              <div className='flex w-full gap-2'>
                {leaderControls ? <>
                  <SkipButton time={-15} />
                  <PlayButton />
                  <SkipButton time={15} />
                </> : <>
                  <div
                    className='flex items-center justify-center w-10 h-10 duration-200 rounded-md cursor-pointer pointer-events-auto group hover:text-accent hover:bg-primary aspcet-square aspect-square'
                  >
                    <ArrowsClockwise 
                      className='w-5 h-5'
                      onClick={onReady}
                    />
                  </div>
                </>}
                  <VolumeBar />
                  <ExpandButton />
                  <FullscreenButton />
              </div>
          </div>
        </PlayerControlsRow>
        <SourceDecoder episodeID={episodeData.data.id} streamData={streamData.data} disablePlayerHead/>
      </PlayerControls>
      <SubtitleDecoder streamData={streamData.data} />
    </MediaPlayer>
    <div className='flex flex-col gap-3 mt-6'>
      <PlayerMediaInfo 
        episodeNumber={episodeData.data.number} 
        localizedAnimeTitle={getLocaleMetadata<Anima.RAW.Anime, Anima.RAW.AnimeMetadata>(animeData.data)?.title || 'Unknown title'}
        localizedEpisodeTitle={getLocaleMetadata<Anima.RAW.Episode, Anima.RAW.EpisodeMetadata>(episodeData.data)?.title || 'Unknown title'}
        seasonNumber={seasonData.data[0].number}
      />
      <p className='text-sm text-subtle'>
        {getLocaleMetadata<Anima.RAW.Episode, Anima.RAW.EpisodeMetadata>(episodeData.data)?.synopsis || 'No synopsis available.'}
      </p>
    </div>
  </>
})

Player.displayName = 'Player'
export default Player
