import React from 'react'
import { useTranslation } from 'react-i18next'

import dayjs from 'dayjs'

import { useMediaStore } from '@vidstack/react'

function Endtime() {
  const { currentTime, duration } = useMediaStore()
  const { t } = useTranslation()

  return (
    <span className='text-sm opacity-60 mr-auto h-full flex items-center'>
       <span className='mr-3'>•</span>{t('player_endtime', {time: dayjs().add(duration - currentTime, 'second').format('hh:mm')})}
    </span>
  )
}

export default Endtime