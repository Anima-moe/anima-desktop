// import anilistService from '@/services/anilist/anilistService';
import { useState, useEffect, useCallback } from 'react';
import { Play, FilmStrip, Books, Star, Calendar } from 'phosphor-react'
// import Skeleton from 'react-loading-skeleton'

import Pill from '@/components/General/Pill'
// import { AnilistMedia } from '../../services/anilist/anilistService'
import { useRouter } from 'next/router'
import { getLocaleMetadata } from '@/services/anima/getMetadataFromMedia';
import Button from '@/components/General/Button';
import { useTranslation } from 'react-i18next';

type Props = {
 anime: Anima.RAW.Anime
}

function AnimeHero({anime}: Props) {
  const [showTrailer, setShowTrailer] = useState(false)
  const [anilistData, setAnilistData] = useState<any | undefined>()
  const { t } = useTranslation()
  const router = useRouter()

  const { background, cover, external_id, AnimeSeason, slug } = anime || {}
  const { title, synopsis, anime_id } = getLocaleMetadata<Anima.RAW.Anime, Anima.RAW.AnimeMetadata>(anime)
  
  // useEffect(()=>{
  //   if (!title) { return };
  //   (async ()=>{
  //     const anilistData = await anilistService.getAnimeByName(title)
  //     setAnilistData(anilistData)
  //   })()
  // }, [title])

  return (
    <div className='flex w-full h-[80vh] px-8 items-center pt-16 relative mb-9 -my-32'>
      <div className={'absolute top-0 left-0 w-full h-full cover z-[-1] overflow-hidden'}>
        {(background) && (
          (background.endsWith('.mp4') || background.endsWith('.webm')) && (
            <video autoPlay loop muted className='w-full h-full object-cover' src={background} />
            )
            )}
      </div>
      <div className={'absolute top-0 left-0 w-full h-full bg-tertiary mix-blend-multiply z-[-1] '} />     
      <div className='flex w-full flex-col absolute -bottom-9 z-0'>
        <div className='w-3/4'>
          <h1 className='font-bold text-5xl'>{title ? title : <></>}</h1>
        </div>
        <div className='flex mt-4 mb-12'>
          { anilistData?.averageScore && <Pill Icon={Star} color='#FF922D'> {anilistData.averageScore/10}  </Pill> }
          { anilistData?.lanch_date ? <Pill Icon={Calendar} color='#ABABAB'> 2019 </Pill> : <></>}
          { AnimeSeason?.length ? <Pill Icon={Books} color='#ABABAB'>{t( AnimeSeason?.length > 1 ? 'anime_generic_seasons' : 'anime_generic_season', {n: AnimeSeason?.length})} </Pill> : <></> }
        </div>
        <div className='w-1/2 flex items-start text-subtle flex-col'>
          <p className='text-sm'>
           {synopsis ? synopsis : <></>}
          </p>
          <div className='w-full flex mt-9'>
            { anime_id ? ( 
              <Button 
                text='Watch'
                Icon={<Play className='order-first mr-4' weight='fill' size={32} />}
                accent
                semibold
                iconLeft
                lg
                className='py-5 px-6 mr-4'
                onClick={()=>{
                  router.push(`/anime/${anime_id || 3750}`)
                }}
              />
            ) : ( 
              <>
              </>
            ) }
            {/* {anilistData?.trailer?.site && ( */}
              <Button 
              text='Trailer'
              Icon={<FilmStrip className='order-first mr-4' weight='fill' size={32} />}
              secondary
              subtle
              semibold
              iconLeft
              lg
              className='py-5 px-6'
              onClick={()=>{
                router.push(`/anime/${anime_id || 3750}`)
              }}
            />
            {/* )} */}
          </div>
        </div>
      </div>

      <style jsx>
        {`
          .cover {
            background-image: url('${background || anilistData?.bannerImage || '/images/banner.png'}');
            background-size: cover;
            background-position: center;
            background-repeate: no-repeat;
            overflow: hidden;
          }
        `}
      </style>
      {/* {anilistData?.trailer && <ModalVideo channel={anilistData.trailer.site} autoplay isOpen={showTrailer} videoId={anilistData.trailer.id} onClose={() => setShowTrailer(false)} controls={0} /> } */}
    </div>
  )
}

export default AnimeHero