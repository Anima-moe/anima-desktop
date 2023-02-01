import { getLocaleMetadata } from '@/services/anima/getMetadataFromMedia'
import { HLSVideo, Media, AspectRatio } from '@vidstack/react'
import React from 'react'
import ControlsContainer from '@/components/Player/ControlsContainer'
import BackButton from './BackButton'
import MediaTitle from './MediaTitle'
import SeasonBrowser from './SeasonBrowser'
import Settings from './Settings'
import useSWR from 'swr'
import { Episode } from '@/services/anima/episode'
import i18next from 'i18next'

type Props = {
  season: Anima.RAW.Season
  episode: Anima.RAW.Episode
}

function Player({season, episode}: Props) {
  const { data: streamData, isLoading: streamLoading, error: streamError } = useSWR<Anima.API.GetEpisodeMedia>(`/episode/${episode.id}/streams`, () => { return Episode.getStreams(episode.id, i18next.language) })

  if (streamLoading) return <div>
    loading
  </div>

  if (streamError) return <div>
    error {JSON.stringify(streamError)}
  </div>

  if (streamData) {
    console.log(streamData)
  }

  if (!streamData) return <div>
    no data
  </div>

  return  <div className='overflow-hidden relative w-full h-full flex items-center justify-center'>
    {/* <div className='aspect-video h-full]'> */}
      {/* <AspectRatio ratio='16/9'> */}
        <Media  view="video" className='justify-center items-center flex w-full' autoplay>
          <HLSVideo className='aspect-video w-full'>
            <div className='w-full h-full flex pointer-events-none absolute top-0 left-0 flex-col'>
              <div className='pointer-events-none absolute top-0 left-0 w-full h-full bg-primary bg-opacity-60' />
              <ControlsContainer>
                <BackButton target={`/anime/${season.anime_id}`} />
                <MediaTitle 
                  seasonNumber={season.number}
                  episodeNumber={episode.number} 
                  episodeTitle={getLocaleMetadata<Anima.RAW.Episode, Anima.RAW.EpisodeMetadata>(episode).title} 
                  />
                <SeasonBrowser episode={episode} season={season} />
                <Settings />
              </ControlsContainer>
              <ControlsContainer bottom>
                {/* {JSON.stringify(season.AnimeEpisode[0].AnimeEpisodeMetadata)} */}
              </ControlsContainer>
            </div>
            <video src={streamData.data[0].hls.hardsub} preload="none" data-video="0" />
          </HLSVideo>
        </Media>
      {/* </AspectRatio> */}
    {/* </div> */}
  </div>
}

export default Player