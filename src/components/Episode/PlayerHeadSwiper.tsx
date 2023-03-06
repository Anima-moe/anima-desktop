import { SkeletonBlock } from 'skeleton-elements/react'
import SwiperCore, { Virtual, Lazy, Navigation } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/virtual'
import 'swiper/css/lazy'
import EpisodePlayerHead from './EpisodePlayerHead'

import dayjs from 'dayjs'

SwiperCore.use([Virtual, Navigation, Lazy])

type Props = {
  playerHeads?: Anima.RAW.UserPlayerHead[]
  loading?: boolean
}

function SwiperPlayerHead({ playerHeads, loading }: Props) {
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
        playerHeads.sort((a, b) => dayjs(b.updated_at).unix() - dayjs(a.updated_at).unix() ).map((playerHead, index) => (
          <SwiperSlide key={playerHead.id} virtualIndex={index} className='mt-4'>
            <EpisodePlayerHead playerHead={playerHead} />
          </SwiperSlide>
        ))
      )}
    </Swiper>
  )
}

export default SwiperPlayerHead
