import { useQuery } from 'react-query'

import axios from 'axios'

import { anilistService } from '@/services/anilist/anilistService'
import { Anime } from '@/services/anima/anime'
import { useMediaPlayer } from '@vidstack/react'

export interface ISkipOpeningProps {
  animeID: number
  episodeNumber: number
}

const fetchSkipOpening = async (malID: number, episodeNumber: number, episodeLength?:number) => {
  if (!episodeLength) { return }
  console.log(`https://api.aniskip.com/v2/skip-times/${malID}/${episodeNumber}/?episodeLength=${episodeLength}}&types=op&types=ed&types=recap`)
  const aniskip = await axios.get(`https://api.aniskip.com/v2/skip-times/${malID}/${episodeNumber}/?episodeLength=${episodeLength}}&types=op&types=ed&types=recap`)
  return aniskip.data
}

export function SkipOpening (props: ISkipOpeningProps) {
  const mediaPlayer = useMediaPlayer()
  const { data: animeData, isLoading: animeLoading, error: animeError } = useQuery(`/api/anime/${props.animeID}`, () => Anime.get(props.animeID))
  const { data: anilistData, isLoading: anilistLoading, error: anilistError } = useQuery(`/api/anime/${props.animeID}/anilist`, () => anilistService.getAnimeByName(animeData.data.AnimeMetadata[0].title))
  const {data: skipOpeningData, isLoading: skipOpeningLoading, error: skipOpeningError} = useQuery(`/api/anime/${props.animeID}/${props.episodeNumber}`, () => fetchSkipOpening(anilistData.idMal, props.episodeNumber, mediaPlayer?.querySelector('video')?.duration))


  if (animeLoading || anilistLoading) {
    return <>Loading</>
  }

  if (!animeData || !anilistData) {
    return <>No data</>
  }

  return (
     <div>
        <h1>Title: {animeData.data.AnimeMetadata[0].title}</h1>
        <h1>MAL: {anilistData.idMal}</h1>
        <span> SKIP AT: {}</span>
    </div>
  )
}
