import { useRouter } from 'next/router'
import React, { useCallback, useEffect, useState } from 'react'
import GeneralLayout from '@/components/Layout/General'
import AnimeCard from '@/components/Anime/AnimeCard'

import { Anime } from '@/services/anima/anime'

import SeasonDisplay from '@/components/Anime/Season'
import { getLocaleMetadata } from '@/services/anima/getMetadataFromMedia'
import { SkeletonBlock, SkeletonText } from 'skeleton-elements/react'
import { AnilistMedia, anilistService } from '@/services/anilist/anilistService'
import AnimeCharacters from '@/components/Anime/AnimeCharacters'
import AnimeStaffs from '@/components/Anime/AnimeStaffs'
import { useTranslation } from 'react-i18next'

function AnimeProperty(props: { heading: string, value: any }) {
  const { t } = useTranslation()

  return <div className='mb-4'>
    <h6 className='text-xs text-subtle mb-1'>{t(props.heading)}</h6>
    { Array.isArray(props.value) ? (
      <ul className='font-semibold'>
        {props.value.map((value) => {
          return <li className='mb-2' key={value}>
            • {value}
          </li>
        })}
      </ul>
    ): (
      <h1 className='text font-semibold'>{props.value}</h1>
    )}
  </div>
}

function AnimePropertySkeleton() {
  return <>
    <h6 className='text-xs w-1/2'><SkeletonBlock borderRadius='.25rem' effect='wave' tag="span" width='100%' height='15px' /></h6>
    <p className='mb-4'> 
      <SkeletonBlock borderRadius='.25rem' effect='wave' tag="span" width='100%' height='20px' className='mt-1.5'/>
    </p>
  </>
}

function AnimePage() {
  const [animeData, setAnimeData] = useState<Anima.RAW.Anime | undefined>()
  const [anilistData, setAnilistData] = useState<AnilistMedia | undefined>()
  const { t } = useTranslation()
  const router = useRouter()
  const { id } = router.query

  const fetchAnimaInfo = useCallback(() => {
    if (!router.isReady) { return }
    (async ()=>{
      try {
        const anime = await Anime.get(Number(id))
        if (!anime.data) { return }
        setAnimeData(anime.data)
  
        const anilist = await anilistService.getAnimeByName(anime.data.AnimeMetadata[0].title)
        if (!anilist) { return }
        setAnilistData(anilist)
      } catch(e) {
        console.error(e)
      }
    })()
  }, [router])

  useEffect(fetchAnimaInfo, [fetchAnimaInfo])

  return <GeneralLayout fluid> 
    <div 
      className='w-full h-[50vh] bg-center bg-cover bg-no-repeat relative -mt-16 z-0 overflow-hidden' 
      style={{backgroundImage: `url('${animeData?.background}')`}}
    >
      {(animeData?.background) ? (
        (animeData.background.endsWith('.mp4') || animeData.background.endsWith('.webm')) && (
          <video autoPlay loop muted className='w-full h-full object-cover' src={animeData.background} />
        )
      ) : ( 
        <video autoPlay loop muted className='w-full h-full object-cover' src='/i/splash.mp4' /> 
      )}
      <div className='w-full h-full absolute top-0 left-0 bg-secondary backdrop-blur-sm mix-blend-multiply bg-opacity-70' />
    </div>
    <div className='w-full flex flex-row -mt-[20vh] z-[2] px-8 relative'>
      <div className='w-1/5 mr-4'>
        {animeData ? (
          <AnimeCard disabled noHover anime={animeData} />
        ) : (
          <div
            className='aspect-[2/3] overflow-hidden rounded-md select-none'
          >
          <SkeletonBlock tag="div" width="100%" effect='wave' borderRadius='.75em' height='100%' />
        </div>
        )}

        <div className='w-full mt-4'>
          { anilistData ? <AnimeProperty heading='anime_heading_status' value={ t('anilist_status_' + anilistData.status)  } /> : <AnimePropertySkeleton /> }
          { anilistData && anilistData.endDate ? <AnimeProperty heading='anime_heading_endDate' value={ t('generic_date', { year: anilistData.endDate.year, month: anilistData.endDate.month, day: anilistData.endDate.day} ) } /> : <AnimePropertySkeleton />}
          { anilistData ? <AnimeProperty heading='anime_heading_averageScore' value={anilistData.averageScore || '🛠️'} /> : <AnimePropertySkeleton /> }
          { anilistData ? <AnimeProperty heading='anime_heading_meanScore' value={anilistData.meanScore || '🛠️'} /> : <AnimePropertySkeleton /> }
          { anilistData ? <AnimeProperty heading='anime_heading_synonyms' value={anilistData.synonyms} /> : <AnimePropertySkeleton /> }
        </div>
      </div>
      <div className='ml-4 w-4/5 flex flex-col'>
        {/* TITLE METADATA */}
        <div className='w-full h-[20vh] items-start justify-end flex flex-col overflow-hidden pb-4'>
          <h6 className='text-xs text-white text-opacity-40'>
            {anilistData ? (
              anilistData?.startDate?.year
            ) : (
              <SkeletonBlock tag="div" width="100px" effect='wave' borderRadius='.2em' height='20px' />
            )}
          </h6>
          <h1 className='text-4xl font-bold line-clamp-2'>{animeData ? (
            getLocaleMetadata<Anima.RAW.Anime, Anima.RAW.AnimeMetadata>(animeData)?.title || 'Unknown title'
          ): (
            <SkeletonBlock tag="div" width="600px" effect='wave' borderRadius='.2em' height='50px' className='my-1.5'/>
          )}</h1>
          <h3 className='text-lg'>
            {anilistData ? (
              anilistData.title.native
            ): (
              <SkeletonBlock tag="div" width="200px" effect='wave' borderRadius='.2em' height='20px' />
            )}
          </h3>
        </div>
        {/* SYNOPSIS */}
        <div className='mt-4 w-3/4'>
          <p className='text-sm text-white text-opacity-70'>
            {animeData ? (
              getLocaleMetadata<Anima.RAW.Anime, Anima.RAW.AnimeMetadata>(animeData)?.synopsis || 'Missing synopsis' 
            ) : (
              <SkeletonText effect='wave' tag="span">
                Lorem ipsum, dolor sit amet consectetur adipisicing elit. Earum
                animi nihil ullam! Asperiores recusandae ullam deleniti, modi
                adipisci omnis alias quis magnam quod quidem dolores exercitationem
                dolor repellendus neque ex.
              </SkeletonText>
            )}
          </p>
        </div>
        {/* SEASONS */}
        <div className='w-full mt-4'>
            {animeData ? (
              animeData.AnimeSeason?.sort((a,b) => a.number - b.number).map(season => {
                return <SeasonDisplay season={season} key={`season.${season.number}.${season.title}`}/>
              })
            ) : <>
              <SkeletonBlock tag="div" width="100%" effect='wave' borderRadius='.2em' height='40px' className='mb-4' />
              <SkeletonBlock tag="div" width="100%" effect='wave' borderRadius='.2em' height='40px' className='mb-4' />
              <SkeletonBlock tag="div" width="100%" effect='wave' borderRadius='.2em' height='40px' className='mb-4' />
            </>}
        </div>

        {/* STAFF & CHARACTERS */}
        { (anilistData && anilistData.characters.edges.length > 0) ? (
          <AnimeCharacters characters={anilistData.characters.edges} /> 
        ): (
           <SkeletonBlock tag="div" width="100%" effect='wave' borderRadius='.2em' height='250px' className='mt-16' />
        )}
        { (anilistData && anilistData.staff.nodes.length > 0) ? (
          <AnimeStaffs staff={anilistData.staff.nodes} />
        ): (
          <SkeletonBlock tag="div" width="100%" effect='wave' borderRadius='.2em' height='250px' className='mt-16' />
        )}
      </div>
    </div>
  </GeneralLayout>
}

export default AnimePage