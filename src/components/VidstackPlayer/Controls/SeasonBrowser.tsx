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

          scrollReference.current.scrollTop = target.offsetTop - 50
        })
      }}
    >
      <Popover.Trigger asChild>
        <button
          className={`
            pointer-events-auto ml-auto cursor-pointer rounded-md border border-transparent bg-transparent px-3
            py-3 text-white duration-300 hover:bg-black hover:text-accent video-control
          `}
        >
          <FilmStrip weight="fill" size={24} />
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          align="end"
          className="'overflow-hidden relative h-max w-max max-w-[20rem] overflow-hidden text-ellipsis whitespace-nowrap rounded-md border border-tertiary bg-secondary px-2 pt-2 text-subtle transition-[height]"
          sideOffset={1}
        >
          <div className="flex w-3/4 items-center overflow-hidden text-ellipsis px-2 pb-4">
            <BookOpen weight="fill" size={16} className="mr-1.5 " />{' '}
            {t('anime_generic_season', { n: season.number })}
          </div>
          <div
            className="-mt-2 flex max-h-[calc(100vh-16rem)] w-full flex-col overflow-scroll pt-2 text-white"
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
          <Popover.Arrow className="fill-secondary stroke-tertiary stroke-2" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}
