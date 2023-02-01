import { useRouter } from 'next/router'
import React, { useCallback, useEffect, useState } from 'react'
import GeneralLayout from '@/components/Layout/General'
import AnimeCard from '@/components/Anime/AnimeCard'

import { Anime } from '@/services/anima/anime'

import SeasonDisplay from '@/components/Anime/Season'
import { getLocaleMetadata } from '@/services/anima/getMetadataFromMedia'

type Props = {}

function AnimePage({}: Props) {
  const [animeData, setAnimeData] = useState<Anima.RAW.Anime | undefined>()

  const router = useRouter()
  const { id } = router.query

  const fetchAnimaInfo = useCallback(() => {
    const currentPath = window.location.href.split('/');
    (async ()=>{
      const anime = await Anime.get(Number(id || currentPath[1]))
      if (anime.data) {
        setAnimeData(anime.data)
      }
    })()
  }, [])

  useEffect(fetchAnimaInfo, [fetchAnimaInfo])

  return <GeneralLayout fluid> 
  { animeData && <>
    <div 
      className='w-full h-[50vh] bg-center bg-cover bg-no-repeat relative -mt-16 z-0' 
      style={{backgroundImage: `url('${animeData.background}')`}}
    >
      {(animeData.background) && (
        (animeData.background.endsWith('.mp4') || animeData.background.endsWith('.webm')) && (
          <video autoPlay loop muted className='w-full h-full object-cover' src={animeData.background} />
        )
      )}
      <div className='w-full h-full absolute top-0 left-0 bg-secondary backdrop-blur-sm mix-blend-multiply bg-opacity-70' />
    </div>
    <div className='w-full flex flex-row -mt-[20vh] z-[1] px-8 relative'>
      <div className='w-1/5 mr-4'>
        <AnimeCard disabled noHover anime={animeData} 
        />
      </div>
      <div className='ml-4 w-4/5 flex flex-col'>
        {/* TITLE METADATA */}
        <div className='w-full h-[20vh] items-start justify-end flex flex-col overflow-hidden pb-4'>
          <h6 className='text-xs text-white text-opacity-40'>2023</h6>
          <h1 className='text-4xl font-bold line-clamp-2'>{getLocaleMetadata<Anima.RAW.Anime, Anima.RAW.AnimeMetadata>(animeData)?.title || 'Unknown title'}</h1>
          <h3 className='text-lg'>イジらないで、長瀞さん</h3>
        </div>
        {/* SYNOPSIS */}
        <div className='mt-4 w-3/4'>
          <p className='text-sm text-white text-opacity-70'>
            {getLocaleMetadata<Anima.RAW.Anime, Anima.RAW.AnimeMetadata>(animeData)?.synopsis || 'Missing synopsis'}
          </p>
        </div>
        {/* SEASONS */}
        <div className='w-full mt-4'>
            {animeData.AnimeSeason.map(season => {
              return <SeasonDisplay season={season} key={`season.${season.number}.${season.title}`}/>
            })}
        </div>
      </div>
    </div>
  </>}
  </GeneralLayout>
}

export default AnimePage