import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'


import dayjs from 'dayjs'

import {User as UserService} from '@/services/anima/user'
import { useMediaStore } from '@vidstack/react'

function Endtime({episodeId}: {episodeId: number}) {
  const { currentTime, duration, paused } = useMediaStore()
  
  useEffect(()=> {
    if (Math.round(currentTime) < 5) { return }

    if (Math.round(currentTime) % 5 === 0 && currentTime > 5) {
      UserService.postEpisodePlayerHead(episodeId, Math.round(duration), Math.round(currentTime))
    }
  }, [Math.round(currentTime)])

  useEffect(()=>{
    if (Math.round(currentTime) < 5) { return }
    
    if (paused) {
      UserService.postEpisodePlayerHead(episodeId, Math.round(duration), Math.round(currentTime))
    }
  }, [paused])

  const { t } = useTranslation()

  return (
    <span className="mr-auto flex h-full items-center text-sm opacity-60">
      <span className="mx-3">•</span>
      {t('player_endtime', {
        time: dayjs()
          .add(duration - currentTime, 'second')
          .format('hh:mm'),
      })}
    </span>
  )
}

export default Endtime
