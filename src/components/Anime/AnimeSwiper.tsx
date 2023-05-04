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
      slidesPerGroup={~~(animesPerScreen / 2)}
      spaceBetween={12}
      navigation
      lazy
      grabCursor
      virtual
      className="w-full text-white rounded-lg noselect"
    >
      {animes ? (
        animes.map((anime, index) => (
          <SwiperSlide key={anime.id} virtualIndex={index}>
            <div
              key={anime.id}
              className="group flex aspect-[3/2] select-none flex-col py-2.5"
              itemID={anime.id.toString()}
            >
              <AnimeCard anime={anime} showDetails={alwaysShowInfo} />
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
        <div className="flex flex-row mt-4 select-none">
          {Array.from({ length: 7 }, (_, index) => index + 1).map((_, index) => {
            return (
              <div
                className="group mx-4 flex aspect-[2/3]"
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
