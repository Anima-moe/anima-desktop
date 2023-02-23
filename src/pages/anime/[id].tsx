import React, { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useRouter } from 'next/router'
import { Calendar, CaretRight, FilmSlate, Graph, IconProps, PlayCircle, Tag } from 'phosphor-react'
import { SkeletonBlock, SkeletonText } from 'skeleton-elements/react'

import AnimeCard from '@/components/Anime/AnimeCard'
import AnimeCharacters from '@/components/Anime/AnimeCharacters'
import AnimeStaffs from '@/components/Anime/AnimeStaffs'
import SeasonDisplay from '@/components/Anime/Season'
import { ReportError } from '@/components/Error/ReportError'
import AlphaRemminder from '@/components/General/AlphaReminder'
import GeneralLayout from '@/components/Layout/General'
import { AnilistMedia, anilistService } from '@/services/anilist/anilistService'
import { Anime } from '@/services/anima/anime'
import { getLocaleMetadata } from '@/services/anima/getMetadataFromMedia'

interface props {
  heading: string
  value: any
  Icon?: React.ForwardRefExoticComponent<IconProps & React.RefAttributes<SVGSVGElement>>
}

function AnimeProperty({ heading, value, Icon }: props) {
  const { t } = useTranslation()

  return (
    <div className='flex flex-col'>
      <div className=" mt-4 w-full bg-secondary rounded-t-md min-h-[3rem] flex items-center px-2 text-subtle">
        { Icon ? <Icon size={24}/> : <Tag size={24}/> }
        <div className='flex flex-col'>
          <span className='text-xs ml-3'>{t(heading)}</span>
          {!Array.isArray(value) ? (
            <p className='ml-3 text-white'>{value}</p>
          ) : (
            <></>
          )}
        </div>
      </div>
          { Array.isArray(value) && <div className='bg-tertiary py-2 rounded-b-md'>
            {value.map((value) => {
            return (
              <p key={`property.item.${value}`} className='ml-3 text-white my-1.5 flex items-center'>
                <CaretRight className='text-subtle mr-1' size={12}/>
                {value}
              </p>
            )
          })}
        </div> }
    </div>
  )
}

function AnimePropertySkeleton() {
  return (
    <>
      <h6 className="w-1/2 text-xs">
        <SkeletonBlock borderRadius=".25rem" effect="wave" tag="span" width="100%" height="15px" />
      </h6>
      <p className="mb-4">
        <SkeletonBlock
          borderRadius=".25rem"
          effect="wave"
          tag="span"
          width="100%"
          height="20px"
          className="mt-1.5"
        />
      </p>
    </>
  )
}

function AnimePage() {
  const [animeData, setAnimeData] = useState<Anima.RAW.Anime | undefined>()
  const [anilistData, setAnilistData] = useState<AnilistMedia | undefined>()
  const { t } = useTranslation()
  const router = useRouter()
  const { id } = router.query

  const fetchAnimaInfo = useCallback(() => {
    if (!router.isReady) {
      return
    }
    ;(async () => {
      try {
        const anime = await Anime.get(Number(id))
        if (!anime.data) {
          return
        }
        setAnimeData(anime.data)

        const anilist = await anilistService.getAnimeByName(anime.data.AnimeMetadata[0].title)
        if (!anilist) {
          return
        }
        setAnilistData(anilist)
      } catch (e) {
        // console.error(e)
      }
    })()
  }, [router])

  useEffect(fetchAnimaInfo, [fetchAnimaInfo])

  return (
    <GeneralLayout fluid>
      <div
        className="aboslute z-0 -mt-16 h-[100vh] w-full overflow-hidden bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url('${animeData?.background || anilistData?.bannerImage}')` }}
      >
        {animeData?.background ? (
          (animeData.background.endsWith('.mp4') || animeData.background.endsWith('.webm')) && (
            <video
              autoPlay
              loop
              muted
              className="h-full w-full object-cover"
              src={animeData.background}
            />
          )
        ) : (
          <video autoPlay loop muted className="h-full w-full object-cover" src="/i/splash.mp4" />
        )}
        <div className="absolute top-0 left-0 h-full w-full" style={{background: 'linear-gradient(180deg, #16161688 0%, #161616 90%)'}} />
      </div>
      <div className="relative -mt-[40vh] z-[2] flex w-full flex-row px-8 bg-primary/60 backdrop-blur-sm">
        <div className="mr-4 w-1/5 -mt-[20vh]">
          {animeData ? (
            <AnimeCard disabled noHover anime={animeData} />
          ) : (
            <div className="aspect-[2/3] select-none overflow-hidden rounded-md">
              <SkeletonBlock
                tag="div"
                width="100%"
                effect="wave"
                borderRadius=".75em"
                height="100%"
              />
            </div>
          )}

          <div className="mt-4 w-full">
            {anilistData ? (
              <AnimeProperty
                heading="anime_heading_status"
                value={t('anilist_status_' + anilistData.status)}
                Icon={FilmSlate}
              />
            ) : (
              <AnimePropertySkeleton />
            )}
            {anilistData && anilistData.endDate ? (
              <AnimeProperty
                heading="anime_heading_endDate"
                value={t('generic_date', {
                  year: anilistData.endDate.year,
                  month: anilistData.endDate.month,
                  day: anilistData.endDate.day,
                })}
                Icon={Calendar}
              />
            ) : (
              <AnimePropertySkeleton />
            )}
            {anilistData ? (
              <AnimeProperty
                heading="anime_heading_averageScore"
                value={anilistData.averageScore || '🛠️'}
                Icon={Graph}
              />
            ) : (
              <AnimePropertySkeleton />
            )}
            {anilistData ? (
              <AnimeProperty heading="anime_heading_synonyms" value={anilistData.synonyms} />
            ) : (
              <AnimePropertySkeleton />
            )}
            {anilistData?.studios ? (
              <AnimeProperty heading="anime_heading_studios" value={anilistData.studios.nodes.map(s=>s.name)} Icon={PlayCircle}/>
            ) : (
              <AnimePropertySkeleton />
            )}
          </div>
        </div>
        <div className="ml-4 flex w-4/5 flex-col -mt-[20vh]">
          {/* TITLE METADATA */}
          <div className='flex flex-row'>
            <div className="flex w-full flex-col items-start justify-end overflow-hidden pb-4 h-[20vh]">
              <h6 className="text-xs text-white text-opacity-40">
                {anilistData ? (
                  anilistData?.startDate?.year
                ) : (
                  <SkeletonBlock
                    tag="div"
                    width="100px"
                    effect="wave"
                    borderRadius=".2em"
                    height="20px"
                  />
                )}
              </h6>
              <h1 className="text-4xl font-bold line-clamp-2">
                {animeData ? (
                  getLocaleMetadata<Anima.RAW.Anime, Anima.RAW.AnimeMetadata>(animeData)?.title ||
                  'Unknown title'
                ) : (
                  <SkeletonBlock
                    tag="div"
                    width="600px"
                    effect="wave"
                    borderRadius=".2em"
                    height="50px"
                    className="my-1.5"
                  />
                )}
              </h1>
              <h3 className="text-lg">
                {anilistData ? (
                  anilistData.title.native
                ) : (
                  <SkeletonBlock
                    tag="div"
                    width="200px"
                    effect="wave"
                    borderRadius=".2em"
                    height="20px"
                  />
                )}
              </h3>
            </div>
            <div className='ml-auto flex flex-col items-start justify-end pb-6'>
              <ReportError anime={animeData} />
            </div>
          </div>
          <div className='w-full'>
            <AlphaRemminder />
          </div>
          {/* SYNOPSIS */}
          <div className="mt-4 w-3/4">
            <p className="text-sm text-white text-opacity-70">
              {animeData ? (
                getLocaleMetadata<Anima.RAW.Anime, Anima.RAW.AnimeMetadata>(animeData)?.synopsis ||
                'Missing synopsis'
              ) : (
                <SkeletonText effect="wave" tag="span">
                  Lorem ipsum, dolor sit amet consectetur adipisicing elit. Earum animi nihil ullam!
                  Asperiores recusandae ullam deleniti, modi adipisci omnis alias quis magnam quod
                  quidem dolores exercitationem dolor repellendus neque ex.
                </SkeletonText>
              )}
            </p>
          </div>
          {/* SEASONS */}
          <div className="mt-4 w-full">
            {animeData ? (
              animeData.AnimeSeason?.sort((a, b) => a.number - b.number).map((season) => {
                return (
                  <SeasonDisplay season={season} key={`season.${season.number}.${season.title}`} />
                )
              })
            ) : (
              <>
                <SkeletonBlock
                  tag="div"
                  width="100%"
                  effect="wave"
                  borderRadius=".2em"
                  height="40px"
                  className="mb-4"
                />
                <SkeletonBlock
                  tag="div"
                  width="100%"
                  effect="wave"
                  borderRadius=".2em"
                  height="40px"
                  className="mb-4"
                />
                <SkeletonBlock
                  tag="div"
                  width="100%"
                  effect="wave"
                  borderRadius=".2em"
                  height="40px"
                  className="mb-4"
                />
              </>
            )}
          </div>

          {/* STAFF & CHARACTERS */}
          {anilistData && anilistData.characters.edges.length > 0 ? (
            <AnimeCharacters characters={anilistData.characters.edges} />
          ) : (
            <SkeletonBlock
              tag="div"
              width="100%"
              effect="wave"
              borderRadius=".2em"
              height="250px"
              className="mt-16"
            />
          )}
          {anilistData && anilistData.staff.nodes.length > 0 ? (
            <AnimeStaffs staff={anilistData.staff.nodes} />
          ) : (
            <SkeletonBlock
              tag="div"
              width="100%"
              effect="wave"
              borderRadius=".2em"
              height="250px"
              className="mt-16"
            />
          )}
        </div>
      </div>
    </GeneralLayout>
  )
}

export default AnimePage
