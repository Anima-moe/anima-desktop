// import { Popover, Transition } from "@headlessui/react"
import {  useRef } from 'react'
import { useTranslation } from 'react-i18next'

import { BookOpen, FilmStrip } from 'phosphor-react'

import EpisodeFatCard from '@/components/Episode/EpisodeFatCard'
import * as Popover from '@radix-ui/react-popover'
import { useMediaRemote } from '@vidstack/react'

type Props = {
  season: Anima.RAW.Season
  episode: Anima.RAW.Episode
}

export default function SeasonBrowser({season, episode}: Props) {
  const mediaRemote = useMediaRemote()
  const scrollReference = useRef<HTMLDivElement>()
  const { t } = useTranslation()
  return <Popover.Root onOpenChange={(o)=>{
    if (o) {
      mediaRemote.pauseUserIdle()
    } else {
      mediaRemote.resumeUserIdle()
    }

    setTimeout(()=>{
      if (!scrollReference.current) return
      const target = scrollReference.current.querySelector(`[data-episode-id="${episode.id}"]`) as HTMLDivElement
      if (!target) return
  
      scrollReference.current.scrollTop = target.offsetTop - 50
    })
  }}>
      <Popover.Trigger asChild>
        <button 
          className={`
            cursor-pointer border hover:bg-black duration-300 px-3 py-3 rounded-md ml-auto
            bg-transparent hover:text-accent pointer-events-auto border-transparent text-white
          `}
        >
           <FilmStrip weight="fill" size={24} />
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content className="bg-secondary rounded-md pt-2 px-2 transition-[height] w-max h-max border border-tertiary max-w-[20rem] relative 'overflow-hidden text-subtle whitespace-nowrap text-ellipsis overflow-hidden" sideOffset={1}>
          <div className="pb-4 px-2 flex items-center text-ellipsis overflow-hidden w-3/4">
              <BookOpen weight="fill" size={16} className='mr-1.5 '/> {t('anime_generic_season', {n: season.number})}
          </div>
          <div className="w-full flex max-h-[calc(100vh-16rem)] overflow-scroll flex-col text-white pt-2 -mt-2" ref={scrollReference}>
              {season.AnimeEpisode.sort((a,b) => a.number-b.number).map((seasonEpisode, index) => {
                return <EpisodeFatCard link={`/episode/${seasonEpisode.id}?seasonid=${season.id}`} episode={seasonEpisode} active={seasonEpisode.id === episode.id} key={`${episode.id}.${episode.number}.${index}`}/>
              })}
          </div>  
          <Popover.Arrow className="fill-secondary stroke-tertiary stroke-2" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
}