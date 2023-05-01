import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import { useAtom } from 'jotai'
import Link from 'next/link'
import { useRouter } from 'next/router'

import { User } from '@/services/anima/user'
import { userPreferedAutoNextEpisode } from '@/stores/atoms'
import { useMediaRemote, useMediaStore } from '@vidstack/react'

import { CommonChapterFormat } from './SeekBar'

interface ISkipBarProps {
  chapter?: CommonChapterFormat
  duration: number
  nextEpisodeId?: number
  episodeId: number
  showNextEpisode?: boolean
}

const blackList = {
  'anime.chapter.episode': true,
  'anime.chapter.canon': true,
  'anime.chapter.teaser': true,
  'anime.chapter.title card': true,
  'anime.chapter.transition': true
}

dayjs.extend(duration)

const SkipBar: React.FunctionComponent<ISkipBarProps> = ({chapter, duration, nextEpisodeId, episodeId, showNextEpisode = true}) => {
  const mediaRemote = useMediaRemote()
  const { currentTime } = useMediaStore()
  const router = useRouter()
  const [automaticNextEpisode] = useAtom(userPreferedAutoNextEpisode)
  const { t } = useTranslation()

  
  useEffect(()=>{
    if (!router.isReady) { return }
    if (!duration || duration < 60) { return }
    if (!nextEpisodeId) { return }

    if ( (currentTime + 0.5 > duration) && automaticNextEpisode && showNextEpisode) {
      setTimeout(()=>{
        User.postEpisodePlayerHead(episodeId, Math.round(duration), Math.round(duration))
        .then(()=>{
          router.push(`/episode/${nextEpisodeId}`)
        })
        .catch(()=>{
          router.push(`/episode/${nextEpisodeId}`)
        })
      }, 1000)
    }
  },[currentTime, router.isReady])

  // There's a chapter, and it's specifically blacklisted for skipoing
  if (chapter && blackList[chapter.identificator.toLowerCase()]) { 
    return  null
  }

  // This is not on the blacklist, and the episode is basically ended, meaning this is not post_credits
  if (nextEpisodeId && (duration - 31) < currentTime){ return (
    <Link 
      href={`/episode/${nextEpisodeId}`} 
      className='ml-auto min-w-[150px] p-4 flex items-center justify-center bg-secondary hover:bg-accent duration-200 rounded-md cursor-pointer mb-2 group select-none relative overflow-hidden'
      onClick={()=>{
        User.postEpisodePlayerHead(nextEpisodeId, Math.round(duration), Math.round(duration))
      }}
    >
        <div 
          className='h-full absolute inset-0 bg-white transition-[width] duration-100 group-hover:bg-accent' 
          style={{width: `${100 - ~~(((duration - currentTime) / 30) * 100)}%`}} 
        />
        {showNextEpisode && (
          <span className='text-white mix-blend-difference group-hover:!mix-blend-normal group-hover:!text-secondary z-[1]'>
            {automaticNextEpisode ? t('anime.chapter.autoNextEpisode', {n: ~~(duration - currentTime)}) : t('anime.chapter.nextEpisode') } 
          </span>
        )}
    </Link>
  ) }

  // There's no chapter, return generic stuff!
  if (!chapter) { return null }
  
  // Get percentage between current time and chapter end time
  const chapterPerc = (currentTime - chapter.startTime) / (chapter.endTime - chapter.startTime) * 100

  return <div 
    className='ml-auto min-w-[150px] p-4 flex items-center justify-center bg-secondary duration-200 rounded-md cursor-pointer mb-2 group absolute right-0 bottom-4 media-user-idle:-translate-y-full overflow-hidden group shadow-lg border-2 border-secondary'
    onClick={()=>{
      mediaRemote.seek(chapter.endTime + 0.5)
    }}
  >
    <div className='h-full absolute inset-0 bg-white transition-[width] duration-100 group-hover:bg-accent' style={{width: `${~~chapterPerc}%`}} />
    <span className='mix-blend-difference text-white select-none z-[1]'>{t(chapter.identificator + 'Skip')}</span>
  </div>
}

export default SkipBar
