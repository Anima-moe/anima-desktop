import { SkeletonBlock } from 'skeleton-elements/react'
import SwiperCore, { Virtual, Lazy, Navigation } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'

import AnimeCard from '@/components/Anime/AnimeCard'
import { getLocaleMetadata } from '@/services/anima/getMetadataFromMedia'

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/virtual'
import 'swiper/css/lazy'

SwiperCore.use([Virtual, Navigation, Lazy])

type Props = {
  animesPerScreen: number
  animes?: Anima.RAW.Anime[]
  loading?: boolean
  alwaysShowInfo?: boolean
}

function SwiperAnime({ animesPerScreen, animes, loading, alwaysShowInfo }: Props) {
  return (
    <Swiper
      slidesPerView={animesPerScreen}
      slidesPerGroup={Math.round(animesPerScreen / 2)}
      // spaceBetween={0}
      navigation
      lazy
      grabCursor
      virtual
      className="noselect w-full rounded-lg text-white"
    >
      {animes ? (
        animes.map((anime, index) => (
          <SwiperSlide key={anime.id} virtualIndex={index}>
            <div
              key={anime.external_id}
              className="group flex aspect-[3/2] select-none flex-col py-2.5"
              style={{
                width: `calc(calc(100vw - calc(1vw + 120px) ) / ${animesPerScreen})`,
                minWidth: `calc(calc(100vw - calc(1vw + 120px) ) / ${animesPerScreen})`,
              }}
              itemID={anime.external_id}
            >
              <AnimeCard anime={anime} noHover={alwaysShowInfo} />
              {alwaysShowInfo && (
                <span className="pt-1 text-sm font-medium">
                  {getLocaleMetadata<Anima.RAW.Anime, Anima.RAW.AnimeMetadata>(anime)?.title ||
                    'No title'}
                </span>
              )}
            </div>
          </SwiperSlide>
        ))
      ) : (
        <div className="mt-4 flex select-none flex-row">
          {Array.from({ length: 7 }, (_, index) => index + 1).map((_, index) => {
            return (
              <div
                className="group mx-4 flex aspect-[2/3]"
                style={{
                  width: 'calc(calc(100vw - calc(1vw + 48px) - 16px) / 7)',
                  minWidth: 'calc(calc(100vw - calc(1vw + 48px) - 16px) / 7)',
                }}
                key={`anime.Skeleton.${index}`}
              >
                <SkeletonBlock
                  borderRadius=".25rem"
                  effect="wave"
                  tag="div"
                  width="100%"
                  height="100%"
                />
              </div>
            )
          })}
        </div>
      )}
    </Swiper>
  )
}

export default SwiperAnime
