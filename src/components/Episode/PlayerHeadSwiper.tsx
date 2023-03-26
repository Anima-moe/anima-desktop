import dayjs from 'dayjs'
import SwiperCore, { Virtual, Lazy, Navigation } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/virtual'
import 'swiper/css/lazy'
import EpisodePlayerHead from './EpisodePlayerHead'


SwiperCore.use([Virtual, Navigation, Lazy])

type Props = {
  playerHeads?: Anima.RAW.UserPlayerHead[]
  loading?: boolean
  hideCompleted?: boolean
  slidesPerView?: number
}

function SwiperPlayerHead({ playerHeads, loading, hideCompleted, slidesPerView }: Props) {
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
      {playerHeads && (
        playerHeads.sort((a, b) => dayjs(b.updated_at).unix() - dayjs(a.updated_at).unix() ).map((playerHead, index) => {
          if (hideCompleted && (playerHead.duration - playerHead.head) < 180) { return null }
          return <SwiperSlide key={playerHead.id} virtualIndex={index} className='my-4'>
            <EpisodePlayerHead playerHead={playerHead} />
          </SwiperSlide>
        }
      ))}
    </Swiper>
  )
}

export default SwiperPlayerHead
