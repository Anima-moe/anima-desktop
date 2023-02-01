import { getLocaleMetadata } from '@/services/anima/getMetadataFromMedia'
import { HLSVideo, Media, AspectRatio } from '@vidstack/react'
import { ArrowLeft } from 'phosphor-react'
import React from 'react'
import ControlsContainer from '@/components/Player/ControlsContainer'
import BackButton from './BackButton'
import MediaTitle from './MediaTitle'
import SeasonBrowser from './SeasonBrowser'

type Props = {
  season: Anima.RAW.Season
  episode: Anima.RAW.Episode
}

function Player({season, episode}: Props) {
  // TODO: Get Stream Data
  return  <div className='overflow-hidden relative w-full h-full flex items-center justify-center'>
    {/* <div className='aspect-video h-full]'> */}
      {/* <AspectRatio ratio='16/9'> */}
        <Media  view="video" className='justify-center items-center flex w-full' autoplay>
          <HLSVideo className='aspect-video w-full'>
            <div className='w-full h-full flex pointer-events-none absolute top-0 left-0 flex-col bg-green-200'>
              <div className='pointer-events-none absolute top-0 left-0 w-full h-full bg-primary bg-opacity-60' />
              <ControlsContainer>
                <BackButton />
                <MediaTitle 
                  seasonNumber={season.number}
                  episodeNumber={episode.number} 
                  episodeTitle={getLocaleMetadata<Anima.RAW.Episode, Anima.RAW.EpisodeMetadata>(episode).title} 
                />
                <SeasonBrowser episode={episode} season={season} />
              </ControlsContainer>
              <ControlsContainer bottom>
                a
              </ControlsContainer>
            </div>
            <video src="https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8" preload="none" data-video="0" />
          </HLSVideo>
        </Media>
      {/* </AspectRatio> */}
    {/* </div> */}
  </div>
}

export default Player