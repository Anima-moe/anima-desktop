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
    <div className="relative -my-32 mb-24 flex h-[80vh] w-full items-center px-8 pt-16">
      <div className={'cover absolute top-0 left-0 z-[-1] h-full w-full overflow-hidden'}>
        {background ? (
          (background.endsWith('.mp4') || background.endsWith('.webm')) && (
            <video autoPlay loop muted className="h-full w-full object-cover" src={background} />
          )
        ) : (
          <video autoPlay loop muted className="h-full w-full object-cover" src="/i/splash.mp4" />
        )}
      </div>
      <div
        className={'absolute top-0 left-0 z-[-1] h-full w-full bg-gradient-to-t from-primary to-primary/70 '}
      />
      <div className="absolute -bottom-9 z-0 flex w-full flex-col">
        <div className="w-3/5">
          <h1 className="text-5xl font-bold">
            {title ? (
              title
            ) : (
              <SkeletonText effect="wave" tag="span" className="rounded-md">
                Anima rocks and no one can take that from us
              </SkeletonText>
            )}
          </h1>
        </div>
        <div className="mt-4 mb-12 flex flex-row">
          {anilistData?.averageScore && (
            <Pill Icon={Star} color="#FF922D">
              {anilistData.averageScore / 10}
            </Pill>
          )}
          {anilistData?.startDate && (
            <Pill Icon={Calendar} color="#ABABAB">
              {t('generic_date', {
                day: anilistData.startDate.day,
                month: anilistData.startDate.month,
                year: anilistData.startDate.year,
              })}
            </Pill>
          )}
           {anilistData?.studios && anilistData.studios.nodes.length > 0 && (
            <Pill Icon={PlayCircle} color="#ABABAB">
              Studio: {anilistData.studios.nodes.filter((s) => s.isAnimationStudio)?.[0]?.name || anilistData.studios.nodes[0].name}
            </Pill>
          )}
          {anilistData?.status && (
            <Pill Icon={FilmSlate} color={anilistData.status === 'FINISHED' ? '#00FFA3' : '#FFB9B9'}>
              {t(`anilist_status_${anilistData.status}`)}
            </Pill>
          )}
          {AnimeSeason?.length ? (
            <Pill Icon={Books} color="#ABABAB">
              {t(AnimeSeason?.length > 1 ? 'anime_generic_seasons' : 'anime_generic_season', {
                n: AnimeSeason?.length,
              })}
            </Pill>
          ) : (
            <SkeletonBlock effect="wave" tag="span" className="mr-4 rounded-md" width='120px' height='29px' borderRadius='1rem' />
          )}
        </div>
        <div className="relative flex w-1/2 flex-col items-start text-subtle">
          <p className="text-sm line-clamp-5">
            {synopsis ? (
              synopsis
            ) : (
              <SkeletonText tag="span" effect="wave" className="rounded-md">
                Lorem ipsum, dolor sit amet consectetur adipisicing elit. Earum animi nihil ullam!
                Asperiores recusandae ullam deleniti, modi adipisci omnis alias quis magnam quod
                quidem dolores exercitationem dolor repellendus neque ex.
              </SkeletonText>
            )}
          </p>
          <div className="mt-9 flex w-full">
            {anime_id ? (
              <Button
                text="Watch"
                Icon={<Play className="order-first mr-4" weight="fill" size={32} />}
                accent
                semibold
                iconLeft
                lg
                className="mr-4 py-5 px-6"
                onClick={() => {
                  router.push(`/anime/${anime_id || 3750}`)
                }}
              />
            ) : (
              <SkeletonBlock
                effect="wave"
                tag="div"
                width="10rem"
                height="3.7rem"
                borderRadius=".25rem"
                className='mr-3'
              />
            )}
            {anilistData?.trailer?.site && (
              <Button
                text="Trailer"
                Icon={<FilmStrip className="order-first mr-4" weight="fill" size={32} />}
                secondary
                subtle
                semibold
                iconLeft
                lg
                className="py-5 px-6"
                onClick={() => {
                  setShowTrailer(true)
                }}
              />
            )}
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

      {showTrailer && <Portal.Root className='absolute top-0 left-0 w-screen h-screen flex items-center justify-center bg-primary/90 backdrop-blur-md z-[99]' onClick={()=>{
        setShowTrailer(false)
      }}>
        <iframe className='w-4/5 aspect-video max-h-screen rounded-lg overflow-hidden' src={`https://www.youtube.com/embed/${anilistData.trailer.id}`} title={`${anilistData.trailer.id}`} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen></iframe>
      </Portal.Root> }
      {/* {anilistData?.trailer && <ModalVideo channel={anilistData.trailer.site} autoplay isOpen={showTrailer} videoId={anilistData.trailer.id} onClose={() => setShowTrailer(false)} controls={0} /> } */}
    </div>
  )
}

export default AnimeHero
