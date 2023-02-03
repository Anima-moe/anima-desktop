import { getLocaleMetadata } from '@/services/anima/getMetadataFromMedia'
import { MediaOutlet, MediaPlayer } from '@vidstack/react'
// import type { MediaElement, HLSVideoElement } from 'vidstack'
import ControlsContainer from '@/components/Player/ControlsContainer'
import BackButton from './Controls/BackButton'
import MediaTitle from './Displays/MediaTitle'
import SeasonBrowser from './Controls/SeasonBrowser'
import Settings from './Settings'
import i18next from 'i18next'
import { useState, useCallback, useEffect, useRef } from 'react'
import SkipButton from '@/components/Player/Controls/SkipButton'
import PlayButton from '@/components/Player/Controls/PlayButton'
import Slider from '@/components/Player/Controls/Slider'
import Timestamp from '@/components/Player/Displays/Timestamp'
import { useRouter } from 'next/router'

type Props = {
  season: Anima.RAW.Season
  episode: Anima.RAW.Episode
  streams: Anima.RAW.EpisodeStream
}

function Player({season, episode, streams}: Props) {
  const [streamURL, setStreamURL] = useState<string | undefined>(undefined)
  const [subURL, setSubURL] = useState<string | undefined>(undefined)
  const router = useRouter()

  useEffect(()=>{
    ;(async ()=>{
      
    })();
  })

  return  <div className='relative w-screen h-screen max-w-screen max-h-screen'>
    <MediaPlayer 
      poster={episode?.thumbnail} 
      view="video" 
      className='w-screen h-screen flex items-center justify-center' 
      aspectRatio={16/9}
      src={`http://localhost:15411/${btoa(streamURL)}.m3u8`}
      controls
    >
      <MediaOutlet />
      <div className='w-full h-full flex pointer-events-none absolute top-0 left-0 flex-col'>
          {/* <div className='pointer-events-none absolute top-0 left-0 w-full h-full bg-primary bg-opacity-60 media-user-idle:bg-opacity-0 media-paused:bg-opacity-95 transition-all duration-300' /> */}
          <ControlsContainer top>
            <span className='w-1/2 whitespace-nowrap overflow-hidden text-ellipsis'>
              STREAM: {btoa(streamURL)}
            </span>
            {/* <BackButton target={`/anime/${season.anime_id}`} />
            <MediaTitle 
              seasonNumber={season?.number}
              episodeNumber={episode?.number} 
              episodeTitle={getLocaleMetadata<Anima.RAW.Episode, Anima.RAW.EpisodeMetadata>(episode).title} 
            /> */}
            <SeasonBrowser episode={episode} season={season} />
            <Settings 
              audios={streams.audios} 
              subtitles={streams.subtitles}
              onAudioChange={(audio) => {
                console.log('audio', audio)
              }}
              onSubtitleChange={(subtitle) => {
                console.log('subtitle', subtitle)
              }}
            />
          </ControlsContainer>
          {/* <ControlsContainer middle>
            <SkipButton backward time={15}/>
            <PlayButton />
            <SkipButton forward time={15}/>
          </ControlsContainer>
          <ControlsContainer bottom>
            <div className='flex w-full'>
              <Timestamp type='current' />
              <Slider />
              <Timestamp type='duration' />
            </div>
          </ControlsContainer> */}
      </div>
    </MediaPlayer>
  </div>
}

export default Player