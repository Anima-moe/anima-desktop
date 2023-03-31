import dayjs from 'dayjs'
import SwiperCore, { Virtual, Lazy, Navigation } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'

import EpisodeItem from '@/components/Episode/EpisodeItem'

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/virtual'
import 'swiper/css/lazy'

SwiperCore.use([Virtual, Navigation, Lazy])

type Props = {
  playerHeads?: Anima.RAW.UserPlayerHead[]
  episodes: Anima.RAW.Episode[]
  loading?: boolean
  hideCompleted?: boolean
  slidesPerView?: number
}


function SwiperEpisode({ playerHeads, loading, hideCompleted, slidesPerView, episodes }: Props) {

  return (
    <Swiper
      modules={[Navigation, Virtual, Lazy]}
      slidesPerView={slidesPerView || 5}
      spaceBetween={12}
      navigation
      lazy
      grabCursor
      virtual
    >
      {episodes && (
        episodes.sort((a, b) => dayjs(b.updated_at).unix() - dayjs(a.updated_at).unix() ).map((episode, index) => {
          return <SwiperSlide key={episode.id} virtualIndex={index} className='my-4'>
            {/* <div className='w-'>
              <EpisodeCard episode={episode}  />
            </div> */}
            <EpisodeItem episode={episode} />
          </SwiperSlide>
        }
      ))}
    </Swiper>
  )
}

export default SwiperEpisode
