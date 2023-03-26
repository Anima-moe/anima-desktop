import { useTranslation } from 'react-i18next'

import Link from 'next/link'

import { User } from '@/services/anima/user'
import { useMediaRemote, useMediaStore } from '@vidstack/react'

import { CommonChapterFormat } from './SeekBar'

interface ISkipBarProps {
  chapter?: CommonChapterFormat
  duration: number
  nextEpisode?: number
}

const blackList = {
  'chapter_episode': true,
  'chapter_canon': true,
  'chapter_teaser': true,
  'chapter_title card': true,
  'chapter_transition': true
}
const SkipBar: React.FunctionComponent<ISkipBarProps> = ({chapter, duration, nextEpisode}) => {
  const mediaRemote = useMediaRemote()
  const { currentTime } = useMediaStore()
  const { t } = useTranslation()
  
  // There's a chapter, and it's specifically blacklisted for skipoing
  if (chapter && blackList[chapter.identificator.toLowerCase()]) { 
    return  null
  }

  // This is not on the blacklist, and the episode is basically ended, meaning this is not post_credits
  if (nextEpisode && chapter && chapter?.endTime + 0.4 >= duration) { return (
    <Link 
      href={`/episode/${nextEpisode}`} 
      className='ml-auto min-w-[150px] p-4 flex items-center justify-center bg-secondary hover:bg-accent duration-200 rounded-md cursor-pointer mb-2 group select-none'
      onClick={()=>{
        User.postEpisodePlayerHead(nextEpisode, Math.round(duration), Math.round(duration))
      }}
    >
        <span className='text-white mix-blend-difference group-hover:text-secondary group-hover:mix-blend-normal'>{t('anime.chapter.nextEpisode')}</span>
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
    <span className='mix-blend-difference text-white select-none z-[1]'>{t('skip_'+chapter.identificator)}</span>
  </div>
}

export default SkipBar
