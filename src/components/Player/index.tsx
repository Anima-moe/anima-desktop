import { useEffect } from 'react'
import React from 'react'
import { useTranslation } from 'react-i18next'

import { useAtom } from 'jotai'
import { MediaPlayerElement } from 'vidstack'

import PlayerControls from '@/components/Player/Containers/Controls'
import PlayerControlsRow from '@/components/Player/Containers/Row'
import FullscreenButton from '@/components/Player/Controls/FullscreenButton'
import SourceDecoder from '@/components/Player/Decoders/Source'
import SubtitleDecoder from '@/components/Player/Decoders/Subtitle'
import PlayerMediaInfo from '@/components/Player/Overlays/MediaState'
import usePresence from '@/hooks/usePresence'
import { getLocaleMetadata } from '@/services/anima/getMetadataFromMedia'
import { playerStreamConfig, userPreferedAutoplay } from '@/stores/atoms'
import { MediaOutlet, MediaPlayer } from '@vidstack/react'

import Loading from '../General/Loading'
import BackButton from './Controls/BackButton'
import ExpandButton from './Controls/ExpandButton'
import PlayButton from './Controls/PlayButton'
import SeasonBrowser from './Controls/SeasonBrowser'
import SeekBar from './Controls/SeekBar'
import SkipButton from './Controls/SkipButton'
import VolumeBar from './Controls/VolumeBar'
import Settings from './Settings'

interface IPlayerProps {
  animeData: Anima.RAW.Anime,
  seasonData: Anima.RAW.Season,
  episodeData: Anima.RAW.Episode,
  streamData: Anima.RAW.EpisodeStream,
}

const Player = React.forwardRef<MediaPlayerElement, IPlayerProps>(({animeData, seasonData, episodeData, streamData}, ref) => {
  const [streamConfig] = useAtom(playerStreamConfig)
  const [userAutoplay] = useAtom(userPreferedAutoplay)
  const { t } = useTranslation()
  const presence = usePresence()

  useEffect(()=>{
    presence.setPresence({
      title: getLocaleMetadata<Anima.RAW.Anime, Anima.RAW.AnimeMetadata>(animeData)?.title || 'Unknown title',
      description: `S${seasonData.number}E${episodeData.number}・${getLocaleMetadata<Anima.RAW.Episode, Anima.RAW.EpisodeMetadata>(episodeData)?.title || 'Unknown episode title'}`,
      watching: true,
      image: 'logo_play',
      deeplink: `/episode/${episodeData.id}`,
      button: t('activity_button_watch')
    })
  }, [])

  return <MediaPlayer 
    ref={ref}
    poster={episodeData.thumbnail}
    load='custom'
    src={`http://localhost:15411/${btoa(streamConfig.streamURL)}.${streamConfig.streamFormat}`}
    aspectRatio={16/9}
    className='flex bg-secondary w-full relative aspect-video rounded overflow-hidden bg-cover bg-center bg-no-repeat items-center justify-center max-w-[100vw] max-h-[100vh]'
    autoplay={userAutoplay}
    userIdleDelay={1000}
  > 
    <MediaOutlet />
    <img src='/i/anima.svg' className='absolute w-32 bottom-4 right-4 opacity-20' />
    <PlayerControls>
      <PlayerControlsRow top>
        <BackButton target={`/anime/${animeData.id}`}/>
        <PlayerMediaInfo 
          episodeNumber={episodeData.number} 
          localizedAnimeTitle={getLocaleMetadata<Anima.RAW.Anime, Anima.RAW.AnimeMetadata>(animeData)?.title || 'Unknown title'}
          localizedEpisodeTitle={getLocaleMetadata<Anima.RAW.Episode, Anima.RAW.EpisodeMetadata>(episodeData)?.title || 'Unknown title'}
          seasonNumber={seasonData.number}
        />
        <SeasonBrowser episode={episodeData} season={seasonData} />
        <Settings audios={streamData?.audios || {}} subtitles={streamData?.subtitles || {}} />
      </PlayerControlsRow>
      {/* LOAD / BUFFER */}
      <div className='absolute top-0 left-0 hidden w-full h-full pointer-events-none media-buffering:flex media-can-play:hidden media-playing:hidden'>
        <Loading />
      </div>
      <PlayerControlsRow bottom>
        <div className='flex flex-col w-full gap-2'>
          <SeekBar animeData={animeData} episodeData={episodeData} seasonData={seasonData}/>
          <div className='flex w-full gap-2'>
            <SkipButton time={-15} />
            <PlayButton />
            <SkipButton time={15} />
            <VolumeBar />
            <ExpandButton />
            <FullscreenButton />
          </div>
        </div>
      </PlayerControlsRow>
      <SourceDecoder episodeID={episodeData.id} streamData={streamData}/>
    </PlayerControls>
    <SubtitleDecoder streamData={streamData} />
  </MediaPlayer>
})

Player.displayName = 'Player'
export default Player
