// import anilistService from '@/services/anilist/anilistService';
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useRouter } from 'next/router'
import { Play, FilmStrip, Books, Star, Calendar, X, PlayCircle, FilmSlate } from 'phosphor-react'
import { SkeletonBlock, SkeletonText } from 'skeleton-elements/react'

import Button from '@/components/General/Button'
import Pill from '@/components/General/Pill'
import { AnilistMedia, anilistService } from '@/services/anilist/anilistService'
import { getLocaleMetadata } from '@/services/anima/getMetadataFromMedia'
import * as Portal from '@radix-ui/react-portal'

import AnimeCard from './AnimeCard'

type Props = {
  anime?: Anima.RAW.Anime
}

function AnimeHero({ anime }: Props) {
  const [showTrailer, setShowTrailer] = useState(false)
  const [anilistData, setAnilistData] = useState<AnilistMedia | undefined>()
  const { t } = useTranslation()
  const router = useRouter()

  const { background, AnimeSeason } = anime || {}
  const { title, synopsis, anime_id } = getLocaleMetadata<Anima.RAW.Anime, Anima.RAW.AnimeMetadata>(anime) || {}

  useEffect(()=>{
    if (!title) { return }

    ;(async ()=>{
      const anilistData = await anilistService.getAnimeByName(title)

      setAnilistData(anilistData)
    })()
  }, [title])
  
  return (
    <div className='flex relative min-h-[90vh] px-8 z-[0]'>
      {/* BACKGROUND */}
      <div className={'cover absolute top-0 left-0 z-[0] h-full w-full overflow-hidden'}>
        {background ? (
          (background.endsWith('.mp4') || background.endsWith('.webm')) && (
            <video autoPlay loop muted className='object-cover w-full h-full' src={background} />
          )
        ) : (
          <video autoPlay loop muted className='object-cover w-full h-full' src='/i/splash.mp4' />
        )}
      </div>
      {/* SHADE */}
      <div className={'absolute inset-0 z-[0] h-full w-full bg-gradient-to-t from-primary to-primary/70'}/>
      <div className={'absolute inset-0 z-[0] h-full w-full bg-transparent backdrop-blur-sm'}/>
      {/* ANIME DATA */}
      <div className='relative z-0 flex items-center w-full h-full mt-8'>
        <div className='flex h-2/3 aspect-[2/3]'>
          <AnimeCard anime={anime} disabled showDetails/>
        </div>
        <div className='flex flex-col w-full ml-10'>
          <div className='w-2/3'>
            {anilistData?.title?.native && <h2 className='opacity-70'>{anilistData?.title?.native}</h2> }
            <h1 className='text-5xl font-bold'>
              {title ? (
                title
              ) : (
                <SkeletonText effect='wave' tag='span' className='rounded-md'>
                  Anima rocks and no one can take that from us
                </SkeletonText>
              )}
            </h1>
          </div>
        <div className='flex flex-row gap-3 mt-4'>
          {anilistData?.averageScore && (
            <Pill Icon={Star} color='#FF922D'>
              {anilistData.averageScore / 10}
            </Pill>
          )}
          {anilistData?.startDate && (
            <Pill Icon={Calendar} color='#ABABAB'>
              {t('generic.date.format', {
                day: anilistData.startDate.day,
                month: anilistData.startDate.month,
                year: anilistData.startDate.year,
              })}
            </Pill>
          )}
           {anilistData?.studios && anilistData.studios.nodes.length > 0 && (
            <Pill Icon={PlayCircle} color='#ABABAB'>
              Studio: {anilistData.studios.nodes.filter((s) => s.isAnimationStudio)?.[0]?.name || anilistData.studios.nodes[0].name}
            </Pill>
          )}
          {anilistData?.status && (
            <Pill Icon={FilmSlate} color={anilistData.status === 'FINISHED' ? '#00FFA3' : '#FFB9B9'}>
              {t(`anilist.status.${anilistData.status}`)}
            </Pill>
          )}
          {AnimeSeason?.length ? (
            <Pill Icon={Books} color='#ABABAB'>
              {t(AnimeSeason?.length > 1 ? 'anime.generic.seasons' : 'anime.generic.season', {
                n: AnimeSeason?.length,
              })}
            </Pill>
          ) : (
            <SkeletonBlock effect='wave' tag='span' className='mr-4 rounded-md' width='120px' height='29px' borderRadius='1rem' />
          )}
        </div>
        <div className='relative flex flex-col items-start w-2/3 gap-9 text-white/60 pt-9'>
          <p className='text-sm line-clamp-6'>
            {synopsis ? (
              synopsis
            ) : (
              <SkeletonText tag='span' effect='wave' className='rounded-md'>
                Lorem ipsum, dolor sit amet consectetur adipisicing elit. Earum animi nihil ullam!
                Asperiores recusandae ullam deleniti, modi adipisci omnis alias quis magnam quod
                quidem dolores exercitationem dolor repellendus neque ex.
              </SkeletonText>
            )}
          </p>
          <div className='flex w-full'>
            {anime_id ? (
              <Button
                text={t('anime.hero.button.watch')}
                Icon={<Play className='order-first mr-4' weight='fill' size={24} />}
                accent
                semibold
                iconLeft
                lg
                className='px-6 py-2 mr-4'
                onClick={() => {
                  router.push(`/anime/${anime_id || 3750}`)
                }}
              />
            ) : (
              <SkeletonBlock
                effect='wave'
                tag='div'
                width='10rem'
                height='3.7rem'
                borderRadius='.25rem'
                className='mr-3'
              />
            )}
            {anilistData?.trailer?.site && (
              <Button
                text={t('anime.hero.button.trailer')}
                Icon={<FilmStrip className='order-first mr-4' weight='fill' size={24} />}
                subtle
                semibold
                iconLeft
                lg
                className='px-6 py-2 hover:bg-accent hover:!text-secondary !duration-100'
                onClick={() => {
                  setShowTrailer(true)
                }}
              />
            )}
          </div>
          </div>
          </div>
      </div>
      <style jsx>
        {`
          .cover {
            background-image: url('${background || anilistData?.bannerImage}');
            background-size: cover;
            background-position: center;
            background-repeate: no-repeat;
            overflow: hidden;
          }
        `}
      </style>

      {showTrailer && <Portal.Root className='fixed top-0 left-0 w-screen h-screen flex items-center justify-center bg-primary/90 backdrop-blur-md z-[99]' onClick={()=>{
        setShowTrailer(false)
      }}>
        <iframe className='w-4/5 max-h-screen overflow-hidden rounded-lg aspect-video' src={`https://www.youtube.com/embed/${anilistData.trailer.id}`} title={`${anilistData.trailer.id}`} allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share' allowFullScreen></iframe>
      </Portal.Root> }
      {/* {anilistData?.trailer && <ModalVideo channel={anilistData.trailer.site} autoplay isOpen={showTrailer} videoId={anilistData.trailer.id} onClose={() => setShowTrailer(false)} controls={0} /> } */}
    </div>
  )
}

export default AnimeHero
