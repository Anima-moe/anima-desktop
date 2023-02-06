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
import { Stream } from '@/services/anima/stream'
import { playerStreamConfig, playerUserPreferences } from '@/stores/atoms'
import { useAtom } from 'jotai'
import type { MediaPlayerElement } from 'vidstack'
import JASSUB from 'jassub'

import 'vidstack/styles/base.css'
import Watermark from './Displays/Watermark'
// import 'vidstack/styles/ui/buttons.css'
// import 'vidstack/styles/ui/sliders.css'

//TODO: FOR THE LOVE OF GOD, MOVE ALL OF THIS useEffect STUFF INTO A CLASS....
//FIXME: REALLY NODGE, MOVE THAT SHIT

type Props = {
  season: Anima.RAW.Season
  episode: Anima.RAW.Episode
  streams: Anima.RAW.EpisodeStream
}

function Player({season, episode, streams}: Props) {
  const [streamConfig, setStreamConfig] = useAtom(playerStreamConfig)
  const [userPreferences, setUserPreferences] = useAtom(playerUserPreferences)
  const [stream, setStream] = useState<string>('https://anima.moe/stream')
  const [subtitleDecoder, setSubtitleDecoder] = useState<JASSUB | undefined>()

  const mediaPlayer = useRef<MediaPlayerElement>()
  const router = useRouter()

  useEffect(()=>{
    if (!router.isReady) { return }
    ;(async ()=>{
      // TODO: Get from user preference: language preference, audio preference
      setStream(streams.hls)
      setStreamConfig({
        ...streamConfig,
        streamURL: streams.hls,
        // subUrl: streams?.[locale]?.subtitles?.[0].url, // TODO: Implement subtitle preference
        subUrl: '',
        audioLocale: streamConfig.audioLocale === '' ? '' : streamConfig.audioLocale || '',
      })   

    })();

  }, [router, mediaPlayer])

  useEffect(()=>{
    if (!mediaPlayer.current || streamConfig.streamURL === stream) { return }

    if (!userPreferences.lastInterruption) {
      setUserPreferences({
        ...userPreferences,
        lastInterruption: mediaPlayer.current.currentTime
      })
    }

    setStream(streamConfig.streamURL)

    if (userPreferences.lastInterruption) {
      mediaPlayer.current.addEventListener('can-play', (ev)=>{
        mediaPlayer.current.currentTime = userPreferences.lastInterruption
        mediaPlayer.current.removeEventListener('can-play', this)
        mediaPlayer.current.play()
      }, {once: true})
      

      setUserPreferences({
        ...userPreferences,
        lastInterruption: undefined
      })
    } 
  }, [streamConfig.streamURL])

  useEffect(()=>{
   
    if (mediaPlayer.current) {
      setUserPreferences({
        ...userPreferences,
        lastInterruption: mediaPlayer.current.currentTime
      })

      mediaPlayer.current.pause()
    }
    
    ;(async ()=>{
      if (streams.audios) { return }

      const newAudio = streams.audios[streamConfig.audioLocale || 'ja-JP']
      const newStream = await Stream.get(episode.id, newAudio.external_id)
       if (streamConfig.streamURL === newStream.data.hls) { 
        return
      }

      setStreamConfig({
        ...streamConfig,
        streamURL: newStream.data.hls
      })
   
    })()
  }, [streamConfig.audioLocale])

  useEffect(()=>{
    const newSubtitle = streams.subtitles[streamConfig.subLocale]
    if (!newSubtitle) { 
      if (subtitleDecoder) {
        subtitleDecoder.freeTrack()
      }
      return 
    }
    if (!mediaPlayer.current) { return }
    ;(async () => {
      if (!subtitleDecoder) {
          const JASSUB = await import('jassub')
    
          const renderer = new JASSUB.default({
            video: document.querySelector('video'),
            subUrl: newSubtitle.url,
            workerUrl: '/s/jassub-worker.js',
          })
    
          console.log("JASSUB",  JASSUB)
          
          setSubtitleDecoder(renderer)
        return
      }

      subtitleDecoder.setTrackByUrl(newSubtitle.url)
    })()

   }, [streamConfig.subLocale, mediaPlayer])


  return  <div className='relative w-screen h-screen max-w-screen max-h-screen'>
    <MediaPlayer 
      poster={episode?.thumbnail} 
      view="video" 
      className='w-screen h-screen flex items-center justify-center' 
      aspectRatio={16/9}
      src={`http://localhost:15411/${btoa(stream)}.m3u8`}
      ref={mediaPlayer}
    >
      <MediaOutlet />
      <div className='w-full h-full flex pointer-events-none absolute top-0 left-0 flex-col justify-between'>
        <div className='pointer-events-none absolute top-0 left-0 w-full h-full bg-black bg-opacity-40 media-user-idle:bg-opacity-0 media-paused:bg-opacity-70 transition-all duration-300' />
        <ControlsContainer top>
          <BackButton target={`/anime/${season.anime_id}`} />
          <MediaTitle 
            seasonNumber={season?.number}
            episodeNumber={episode?.number} 
            episodeTitle={getLocaleMetadata<Anima.RAW.Episode, Anima.RAW.EpisodeMetadata>(episode).title} 
          />
          <SeasonBrowser episode={episode} season={season} />
          <Settings 
            audios={streams.audios} 
            subtitles={streams.subtitles}
          />
        </ControlsContainer>
        <ControlsContainer middle>
          
        </ControlsContainer>
        <ControlsContainer bottom>
          <span className='w-full text-xs whitespace-nowrap overflow-hidden text-ellipsis flex-col flex opacity-20 select-none'>
            <span>STREAM: {streamConfig.audioLocale} @ {btoa(stream)}</span>
            <span>SUBTITLE: {streamConfig.subLocale} @ {streamConfig.subUrl}</span>
          </span>
          
          <div className='flex w-full items-center mb-4'>
            <Timestamp type='current' />
            <Slider />
            <Timestamp type='duration' />
          </div>
          <div className='flex flex-row w-full py-4'>
            <SkipButton backward time={15}/>
            <PlayButton />
            <SkipButton forward time={15}/>
          </div>
        </ControlsContainer>
      </div>
    </MediaPlayer>
  </div>
}

export default Player