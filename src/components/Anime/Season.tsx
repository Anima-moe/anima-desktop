import { useState } from 'react'
import { UnmountClosed } from 'react-collapse'
import { useTranslation } from 'react-i18next'

import Link from 'next/link'
import { CaretDown, CaretUp } from 'phosphor-react'

import EpisodeCard from '../Episode/EpisodeCard'

type Props = {
  season: Anima.RAW.Season
}

function Season({ season }: Props) {
  const [expanded, setExpanded] = useState(false)
  const { t } = useTranslation()

  const onToggleExpand = () => {
    setExpanded(!expanded)
  }

  return (
    <div className="mb-4">
      <div
        className={`w-full bg-tertiary px-4 py-2 duration-300 hover:bg-subtle hover:text-white ${
          expanded ? 'rounded-t-md' : 'rounded-md'
        } flex cursor-pointer select-none flex-row justify-between  font-semibold`}
        onClick={onToggleExpand}
        onKeyDown={(e) => {
          if (e.code === 'Enter' || e.code === 'Space') {
            onToggleExpand()
          }
        }}
        role="button"
        tabIndex={0}
      >
        <span className="w-full">
          {t('anime_generic_season', { n: season.number })} - {season.title}
        </span>
        {expanded ? <CaretDown size={24} /> : <CaretUp size={24} />}
      </div>
      <UnmountClosed
        isOpened={expanded}
        theme={{ collapse: 'transition-[height] duration-300 mb-4' }}
      >
        {season.AnimeEpisode.sort((a, b) => a.number - b.number).map((episode, index) => {
          return (
            <div
              className="group flex w-full cursor-pointer flex-row bg-secondary px-2 py-4 duration-300 last-of-type:rounded-b-md hover:bg-accent hover:text-secondary"
              key={`season.episode.${episode.id}`}
            >
              <Link href={`/episode/${episode.id}?seasonid=${season.id}`}>
                <EpisodeCard episode={episode} />
              </Link>
            </div>
          )
        })}
      </UnmountClosed>
    </div>
  )
}

export default Season
