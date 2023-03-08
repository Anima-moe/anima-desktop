// import { Popover, Transition } from "@headlessui/react"
import { useRef } from 'react'
import { useTranslation } from 'react-i18next'

import { BookOpen, FilmStrip } from 'phosphor-react'

import EpisodeFatCard from '@/components/Episode/EpisodeFatCard'
import * as Popover from '@radix-ui/react-popover'
import { useMediaRemote } from '@vidstack/react'

type Props = {
  season: Anima.RAW.Season
  episode: Anima.RAW.Episode
}

export default function SeasonBrowser({ season, episode }: Props) {
  const mediaRemote = useMediaRemote()
  const scrollReference = useRef<HTMLDivElement>()
  const { t } = useTranslation()
  return (
    <Popover.Root
      onOpenChange={(o) => {
        if (o) {
          mediaRemote.pauseUserIdle()
        } else {
          mediaRemote.resumeUserIdle()
        }

        setTimeout(() => {
          if (!scrollReference.current) return
          const target = scrollReference.current.querySelector(
            `[data-episode-id="${episode.id}"]`
          ) as HTMLDivElement
          if (!target) return

          scrollReference.current.scrollTop = target.offsetTop - 115
        })
      }}
    >
      <Popover.Trigger asChild>
        <button
          className={`
            pointer-events-auto ml-auto cursor-pointer rounded-md border border-transparent bg-transparent px-2
            py-2 text-white duration-300 hover:bg-black hover:text-accent video-control
          `}
        >
          <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" className='w-6 h-6'>
            <path d="M16.6927 25.3346C16.3245 25.3346 16.026 25.0361 16.026 24.6679L16.026 7.3346C16.026 6.96641 16.3245 6.66794 16.6927 6.66794L18.6927 6.66794C19.0609 6.66794 19.3594 6.96642 19.3594 7.3346L19.3594 24.6679C19.3594 25.0361 19.0609 25.3346 18.6927 25.3346H16.6927Z" fill="currentColor" />
            <path d="M24.026 25.3346C23.6578 25.3346 23.3594 25.0361 23.3594 24.6679L23.3594 7.3346C23.3594 6.96641 23.6578 6.66794 24.026 6.66794L26.026 6.66794C26.3942 6.66794 26.6927 6.96642 26.6927 7.3346V24.6679C26.6927 25.0361 26.3942 25.3346 26.026 25.3346H24.026Z" fill="currentColor" />
            <path d="M5.48113 23.9407C5.38584 24.2963 5.59689 24.6619 5.95254 24.7572L7.88439 25.2748C8.24003 25.3701 8.60559 25.159 8.70089 24.8034L13.1871 8.06067C13.2824 7.70503 13.0713 7.33947 12.7157 7.24417L10.7838 6.72654C10.4282 6.63124 10.0626 6.8423 9.96733 7.19794L5.48113 23.9407Z" fill="currentColor" />
          </svg>
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          align="end"
          className="'overflow-hidden relative h-max overflow-hidden text-ellipsis whitespace-nowrap rounded-md border border-tertiary bg-secondary px-2 pt-2 text-subtle transition-[height]"
        >
          <div className="flex w-[250px] items-center overflow-hidden text-ellipsis px-2 pb-4">
            <BookOpen weight="fill" size={16} className="mr-1.5 " />{' '}
            <span className='w-full overflow-hidden text-ellipsis'>{t('anime_generic_season', { n: season.title })}</span>
          </div>
          <div
            className="-mt-2 flex max-h-[calc(100vh-32rem)] w-[250px] flex-col overflow-scroll pt-2 text-white"
            ref={scrollReference}
          >
            {season.AnimeEpisode.sort((a, b) => a.number - b.number).map((seasonEpisode, index) => {
              return (
                <EpisodeFatCard
                  link={`/episode/${seasonEpisode.id}?seasonid=${season.id}`}
                  episode={seasonEpisode}
                  active={seasonEpisode.id === episode.id}
                  key={`${episode.id}.${episode.number}.${index}`}
                />
              )
            })}
          </div>
          <Popover.Arrow className="fill-secondary stroke-tertiary text-secondary" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}