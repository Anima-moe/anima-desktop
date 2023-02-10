import { forwardRef, ForwardedRef } from 'react'
// import { getLocaleMetadata } from '@/services/anima/getMetadataFromMedia'
import { MediaOutlet, MediaPlayer } from '@vidstack/react'
// // import type { MediaElement, HLSVideoElement } from 'vidstack'
import ControlsContainer from '@/components/Player/ControlsContainer'
import BackButton from './Controls/BackButton'
import MediaTitle from '@/components/Player/Displays/MediaTitle'
import SeasonBrowser from './Controls/SeasonBrowser'
import Settings from './Settings'
import i18next from 'i18next'
import SkipButton from '@/components/Player/Controls/SkipButton'
import PlayButton from '@/components/Player/Controls/PlayButton'
import FullscreenButton from '@/components/Player/Controls/FullscreenButton'
import Slider from '@/components/Player/Controls/Slider'
import Timestamp from '@/components/Player/Displays/Timestamp'
// import { useRouter } from 'next/router'
// import { Stream } from '@/services/anima/stream'
import { playerStreamConfig, playerSwitchingStream, userPreferedSubtitles } from '@/stores/atoms'
import { useAtom } from 'jotai'
import type { MediaPauseEvent, MediaPlayerElement } from 'vidstack'


import 'vidstack/styles/base.css'
import JotaiNexus from 'jotai-nexus'
import { getLocaleMetadata } from '@/services/anima/getMetadataFromMedia'
import StreamLoading from '@/components/Player/Displays/StreamLoading'
import Endtime from '@/components/Player/Displays/Endtime'
import Subtitles from '@/components/Player/Displays/Subtitles'
import { userPreferedAudio } from '../../stores/atoms';
import PipButton from '@/components/Player/Controls//PipButton'


type Props = {
  episodeData: Anima.RAW.Episode,
  seasonData: Anima.RAW.Season,
  streamData: Anima.RAW.EpisodeStream
}

export default forwardRef<MediaPlayerElement, Props>((props, ref) => {
  const [streamConfig, setStreamConfig] = useAtom(playerStreamConfig)
  const [ userPreferedSubtitlesAtom, setUserPreferedSubtitlesAtom ] = useAtom(userPreferedSubtitles)
  const [ userPreferedAudioAtom, setUserPreferedAudioAtom ] = useAtom(userPreferedAudio)

  return <MediaPlayer
    poster={props.episodeData.thumbnail}
    ref={ref}
    src={streamConfig.streamURL}
  >
    {/* {JSON.stringify(streamConfig)} */}
    <MediaOutlet />
    <Subtitles />
    <div className='w-full h-full flex pointer-events-none absolute top-0 left-0 flex-col justify-between'>
      <div className='pointer-events-none absolute top-0 left-0 w-full h-full bg-primary bg-opacity-40 media-user-idle:bg-opacity-0 media-paused:bg-opacity-70 transition-all duration-300' />
      <ControlsContainer top>
        <BackButton target={`/anime/${props.seasonData.anime_id}`} />
        <MediaTitle 
          seasonNumber={props.seasonData.number}
          episodeNumber={props.episodeData.number} 
          episodeTitle={getLocaleMetadata<Anima.RAW.Episode, Anima.RAW.EpisodeMetadata>(props.episodeData).title} 
        />
        <SeasonBrowser episode={props.episodeData} season={props.seasonData} />
        <Settings 
          audios={props.streamData.audios} 
          subtitles={props.streamData.subtitles}
        />
      </ControlsContainer>
      <ControlsContainer middle>
        
      </ControlsContainer>
      <ControlsContainer bottom>     
        <div className='flex w-full items-center mb-4'>
          <Timestamp type='current' />
          <Slider />
          <Timestamp type='duration' />
        </div>
        <div className='flex flex-row w-full py-2 items-center'>
          <SkipButton backward time={15}/>
          <PlayButton />
          <SkipButton forward time={15}/>
          <Endtime />
          <PipButton />
          <FullscreenButton />
        </div>
      </ControlsContainer>
    </div>
    <JotaiNexus />
  </MediaPlayer>
})
