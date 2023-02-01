import { useRouter } from 'next/router'
import GeneralLayout from '@/components/Layout/General'
import { Scrollbars } from 'react-custom-scrollbars'

import 'vidstack/styles/base.css'
import 'vidstack/styles/ui/buttons.css'
import 'vidstack/styles/ui/sliders.css'

import MediaLayout from '@/components/Layout/Media'
import { Season } from '@/services/anima/season'
import { useCallback, useEffect, useRef, useState } from 'react'
import Player from '@/components/Player'
import EpisodeFatCard from '@/components/Episode/EpisodeFatCard'

type Props = {}

function index({}: Props) {
  const router = useRouter()
  const [seasonData, setSeasonData] = useState<Anima.RAW.Season | undefined>()
  const [episodeData, setEpisodeData] = useState<Anima.RAW.Episode | undefined>()
  const scrollbar = useRef()

  const fetchAnimaInfo = useCallback(() => {
    const currentPath = window.location.href.split('/');

    (async ()=>{
      console.log(currentPath)
      const season = await Season.get(Number(currentPath[4]))
      console.log("Fetching season", currentPath[4], season)
      // setSeasonData(season.data[0])
      setSeasonData(season.data[0])
      setEpisodeData(season.data[0].AnimeEpisode.filter((episode)=>episode.id === Number(currentPath[5]))[0])
    })()
   
  }, [])

  useEffect(fetchAnimaInfo, [router])

  if (!router.isReady) {
    return <div>
      loading
    </div>
  }

  if (!seasonData) return <div>
    load
  </div>

  return <MediaLayout>
        <Player episode={episodeData} season={seasonData} />
    </MediaLayout>
}

export default index