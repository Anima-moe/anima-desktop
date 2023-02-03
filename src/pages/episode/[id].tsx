import { useRouter } from 'next/router'
import GeneralLayout from '@/components/Layout/General'
import { Scrollbars } from 'react-custom-scrollbars'

// import 'vidstack/styles/base.css'
// import 'vidstack/styles/ui/buttons.css'
import 'vidstack/styles/ui/sliders.css'

import MediaLayout from '@/components/Layout/Media'
import { Season } from '@/services/anima/season'
import { useCallback, useEffect, useRef, useState } from 'react'
import Player from '@/components/Player'
import EpisodeFatCard from '@/components/Episode/EpisodeFatCard'
import { Episode } from '@/services/anima/episode'
import i18next from 'i18next'
import StreamError from '@/components/Player/Displays/StreamError'

type Props = {}

function index({}: Props) {

  const router = useRouter()
  const [seasonData, setSeasonData] = useState<Anima.RAW.Season | undefined>()
  const [episodeData, setEpisodeData] = useState<Anima.RAW.Episode | undefined>()
  const [streamData, setStreamData] = useState<Anima.RAW.EpisodeStream | undefined>()
  const [error, setError] = useState<Error | undefined>()

  useEffect(()=>{
      if (!router.isReady) { return }
      setError(undefined)
      ;(async ()=>{
        const episodeID = Number(router.query.id)
        const seasonID = router.asPath.split('?')[1].split('=')[1]
        try {
          const season = await Season.get(Number(seasonID))
          setSeasonData(season.data[0])
          setEpisodeData(season.data[0].AnimeEpisode.filter((episode)=>episode.id === episodeID)[0])
    
          const stream = await Episode.getStreams(episodeID, i18next.language)
          setStreamData(stream.data)
        } catch(e) {
          setError(e)
        }
      })()
  }, [router])

  if (!seasonData && !error) return <div>
    loading
  </div>

  return <>
    {streamData && (
      <MediaLayout>
          <Player episode={episodeData} season={seasonData} streams={streamData} />
      </MediaLayout>
    )} 
    {error && (
      <GeneralLayout>
        <StreamError error={error} />
      </GeneralLayout>
    )}
  </>
}

export default index