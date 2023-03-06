import { useTranslation } from 'react-i18next'

import Link from 'next/link'

import { useMediaRemote } from '@vidstack/react'

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
  const { t } = useTranslation()
  
  // There's a chapter, but it's not in the whitelist, return null
  if (chapter && blackList[chapter.identificator.toLowerCase()]) { 
    return  null
  }

  // This is not on the blacklist, and the episode is basically ended, meaning this is not post_credits
  if (nextEpisode && chapter && chapter?.endTime + 0.4 >= duration) { return (
    <Link 
      href={`/episode/${nextEpisode}`} 
      className='ml-auto min-w-[150px] p-4 flex items-center justify-center bg-secondary hover:bg-accent duration-200 rounded-md cursor-pointer mb-2 group select-none'
    >
        <span className='mix-blend-difference text-white group-hover:text-secondary group-hover:mix-blend-normal'>{t('next_episode')}</span>
    </Link>
  ) }

  // There's no chapter, return generic stuff!
  if (!chapter) { return null }
  
  return <div 
    className='ml-auto min-w-[150px] p-4 flex items-center justify-center bg-secondary hover:bg-accent duration-200 rounded-md cursor-pointer mb-2 group'
    onClick={()=>{
      mediaRemote.seek(chapter.endTime + 0.5)
    }}
  >
    <span className='mix-blend-difference text-white group-hover:text-secondary group-hover:mix-blend-normal select-none'>{t('skip_'+chapter.identificator)}</span>
  </div>
}

export default SkipBar
