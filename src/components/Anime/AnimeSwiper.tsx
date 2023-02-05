import SwiperCore, { Virtual, Lazy, Navigation } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'

import AnimeCard from '@/components/Anime/AnimeCard'
import { getLocaleMetadata } from '@/services/anima/getMetadataFromMedia'

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/virtual'
import 'swiper/css/lazy'
// import Skeleton from 'react-loading-skeleton'
import { SkeletonBlock } from 'skeleton-elements/react'

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
        {animes ? animes.map((anime, index) => (
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
        )) : (
          <div className='flex flex-row select-none mt-4'>
            { Array.from({length: 7}, (_, index) => index + 1).map((_, index)=>{
              return    <div
                    className='aspect-[2/3] group flex mr-4'
                    style={{
                      width: `calc(calc(100vw - calc(1vw + 48px) - 16px) / 7)`,
                      minWidth: `calc(calc(100vw - calc(1vw + 48px) - 16px) / 7)`
                    }}
                    key={`anime.Skeleton.${index}`}
                  >
                <SkeletonBlock borderRadius='.25rem' effect='wave' tag='div' width='100%' height='100%' />
              </div>
            }) }
          </div>
        )}
      </Swiper>
  );
}

export default SwiperAnime;