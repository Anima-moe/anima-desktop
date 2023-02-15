import { forwardRef } from 'react'

import { useAtom } from 'jotai'
import JotaiNexus from 'jotai-nexus'
import { CircleNotch } from 'phosphor-react'
import type { MediaPlayerElement, MediaSourceChangeEvent } from 'vidstack'

import BackButton from '@/components/VidstackPlayer/Controls/BackButton'
import FullscreenButton from '@/components/VidstackPlayer/Controls/FullscreenButton'
import PlayButton from '@/components/VidstackPlayer/Controls/PlayButton'
import SeasonBrowser from '@/components/VidstackPlayer/Controls/SeasonBrowser'
import Settings from '@/components/VidstackPlayer/Controls/Settings'
import ShortcutCollector from '@/components/VidstackPlayer/Controls/ShortcutCollectors'
import SkipButton from '@/components/VidstackPlayer/Controls/SkipButton'
import Slider from '@/components/VidstackPlayer/Controls/Slider'
import ControlsContainer from '@/components/VidstackPlayer/ControlsContainer'
import Endtime from '@/components/VidstackPlayer/Displays/Endtime'
import MediaTitle from '@/components/VidstackPlayer/Displays/MediaTitle'
import Timestamp from '@/components/VidstackPlayer/Displays/Timestamp'
import { getLocaleMetadata } from '@/services/anima/getMetadataFromMedia'
import { playerStreamConfig } from '@/stores/atoms'
import { MediaOutlet, MediaPlayer, MediaPoster } from '@vidstack/react'

import 'vidstack/styles/base.css'
import { SkipChapter } from './Controls/SkipChapter'
import VolumeControl from './Controls/VolumeControl'
import CaptionList from './Displays/Subtitles/List'

type Props = {
  episodeData: Anima.RAW.Episode,
  seasonData: Anima.RAW.Season,
  streamData: Anima.RAW.EpisodeStream
  myAnimeListId?: number
  onCanLoad?: () => void
  onSourceChange?: (newStream: MediaSourceChangeEvent) => void
}

const Player =  forwardRef<MediaPlayerElement, Props>((props, ref) => {
  const [streamConfig] = useAtom(playerStreamConfig)

  return <MediaPlayer
    poster={props.episodeData.thumbnail}
    ref={ref}
    src={streamConfig.streamURL}
    onSourceChange={props.onSourceChange}
    onCanLoad={props.onCanLoad}
    load='custom'
    aspectRatio={16/9}
    userIdleDelay={400}
  >
    {/* {JSON.stringify(streamConfig)} */}
    <MediaOutlet />
    {/* <MediaPoster alt={getLocaleMetadata<Anima.RAW.Episode, Anima.RAW.EpisodeMetadata>(props.episodeData)?.title} /> */}
    <ShortcutCollector />
    <div className='w-full h-full flex pointer-events-none absolute top-0 left-0 flex-col justify-between'>
      <div className='pointer-events-none absolute top-0 left-0 w-full h-full bg-primary bg-opacity-40 media-user-idle:bg-opacity-0 media-paused:bg-opacity-70 transition-all duration-300 media-waiting:bg-black media-waiting:opacity-90' />
      {streamConfig?.subtitleURL?.endsWith('.vtt') && (
        <div className='absolute w-full h-full pointer-events-none'>
          <CaptionList />
        </div> 
      )}
      <img src='/i/anima.svg' className='right-4 bottom-20 media-user-idle:bottom-4 media-user-idle:opacity-40 absolute opacity-80 transition-all duration-300 media-waiting:opacity-0' />
      <SkipChapter animeID={props.seasonData.anime_id} episodeNumber={props.episodeData.number} />
      <ControlsContainer top>
        <BackButton target={`/anime/${props?.seasonData?.anime_id}`} />
        <MediaTitle 
          seasonNumber={props?.seasonData?.number}
          episodeNumber={props?.episodeData?.number} 
          episodeTitle={getLocaleMetadata<Anima.RAW.Episode, Anima.RAW.EpisodeMetadata>(props.episodeData)?.title} 
        />
        <Endtime />
        <SeasonBrowser episode={props.episodeData} season={props.seasonData} />
        <Settings 
          audios={props?.streamData?.audios} 
          subtitles={props?.streamData?.subtitles}
        />
      </ControlsContainer>
      <div className='w-32 h-32 absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 media-waiting:block hidden text-accent'>
        <CircleNotch weight='fill' className='w-full h-full animate-spin'/>
      </div>
      <ControlsContainer bottom>     
        <div className='flex flex-row w-full p-3 items-center rounded-md backdrop-blur-md bg-opacity-30 bg-primary'>
          <SkipButton time={-15}/>
          <PlayButton />
          <SkipButton time={15}/>
          <VolumeControl />
          <div className='flex w-full items-center px-4'>
            <Timestamp type='current' />
            <Slider />
            <Timestamp type='duration' />
          </div>
          <FullscreenButton />
        </div>
      </ControlsContainer>
    </div>
    <JotaiNexus />
  </MediaPlayer>
})

Player.displayName = 'Player'

export default Player