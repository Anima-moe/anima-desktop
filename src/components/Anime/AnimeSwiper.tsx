import SwiperCore, { Virtual, Lazy, Navigation } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'

import AnimeCard from '@/components/Anime/AnimeCard'
import { getLocaleMetadata } from '@/services/anima/getMetadataFromMedia'

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/virtual'
import 'swiper/css/lazy'

SwiperCore.use([Virtual, Navigation, Lazy]);

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
        spaceBetween={128}
        navigation
        lazy
        grabCursor
        virtual
        className="w-full rounded-lg text-white noselect"
      >
        {animes?.map((anime, index) => (
          <SwiperSlide key={anime.id} virtualIndex={index}>
            <div 
              key={anime.external_id} 
              className='aspect-[3/2] group py-2.5 flex flex-col select-none'
              style={{
                width: `calc(calc(100vw - calc(1vw + 48px) - 16px) / ${animesPerScreen})`,
                minWidth: `calc(calc(100vw - calc(1vw + 48px) - 16px) / ${animesPerScreen})`
              }}
              itemID={anime.external_id}
            >
              <AnimeCard 
                anime={anime}
                noHover={alwaysShowInfo}
              />
              {alwaysShowInfo && <span className='pt-1 text-sm font-medium'>
                {getLocaleMetadata<Anima.RAW.Anime, Anima.RAW.AnimeMetadata>(anime)?.title || 'No title'}
              </span>}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
  );
}

export default SwiperAnime;