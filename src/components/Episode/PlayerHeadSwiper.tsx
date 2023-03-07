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
}

function SwiperPlayerHead({ playerHeads, loading, hideCompleted }: Props) {
  return (
    <Swiper
      modules={[Navigation, Virtual, Lazy]}
      slidesPerView={5}
      spaceBetween={12}
      navigation
      lazy
      grabCursor
      virtual
    >
      {playerHeads && (
        playerHeads.sort((a, b) => dayjs(b.updated_at).unix() - dayjs(a.updated_at).unix() ).map((playerHead, index) => {
          if (hideCompleted && (playerHead.duration - playerHead.head) < 90) { return null }
          return <SwiperSlide key={playerHead.id} virtualIndex={index} className='mt-4'>
            <EpisodePlayerHead playerHead={playerHead} />
          </SwiperSlide>
        }
      ))}
    </Swiper>
  )
}

export default SwiperPlayerHead
