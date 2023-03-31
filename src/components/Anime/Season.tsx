import { useState } from 'react'
import { UnmountClosed } from 'react-collapse'
import { useTranslation } from 'react-i18next'

import Link from 'next/link'
import { CaretDown, CaretUp } from 'phosphor-react'
import { useWindowSize } from 'usehooks-ts'

import EpisodeCard from '../Episode/EpisodeCard'
import EmojiOptionsInput from '../General/Inputs/EmojiSelectionInput'

type Props = {
  seasons: Anima.RAW.Season[]
}

const calculateItemsPerRow = (width: number) => {
  if (width < 1601) return 3
  // if (width < 1600) return 6
  if (width < 1921) return 4
  if (width < 2561) return 5
  if (width < 3200) return 6
  if (width < 3841) return 7
  return 6
}

function Season({ seasons }: Props) {
  const [expanded, setExpanded] = useState(false)
  const [activeSeason, setActiveSeason] = useState(seasons?.sort((a, b) => a.number - b.number)[0])
  const [sortOrder, setSort] = useState<'number' | 'airDate'>('number')
  const { t } = useTranslation()
  const windowSize = useWindowSize()
  
  const onToggleExpand = () => {
    setExpanded(!expanded)
  }
  
  return (
   
      <div className="flex flex-col gap-2 mb-4">
        <div className='flex gap-2 max-w-[60%] whitespace-nowrap'>
          <EmojiOptionsInput
            className='!font-normal !text-xs'
            options={seasons?.sort((a, b) => a.number - b.number).map((season) => ({ label: `${t('anime.generic.season', { n: season.number })} - ${season.title}`, value: season.id.toString(), emoji: '🎬' })) ?? []}
            onSelect={(value) => {
              setActiveSeason(seasons?.find((season) => season.id.toString() === value))
            }}
          />
          <EmojiOptionsInput
            className='!font-normal !text-xs min-w-[250px]'
            options={[
              { label: t('anime.generic.sort.number'), value: 'number', emoji: '🔢' },
              { label: t('anime.generic.sort.airDate'), value: 'airDate', emoji: '📅' },
            ]}
            onSelect={(value) => {
              setSort(value as 'number' | 'airDate')
            }}
          />
        </div>
        <div className='flex flex-wrap gap-y-4'>
            {activeSeason?.AnimeEpisode.sort((a, b) => sortOrder === 'number' ? (a.number - b.number) : (b.number - a.number)).map((episode, index) => {
              return <Link 
                href={`/episode/${episode.id}`}  
                key={`anime.episode.${episode.id}`} 
                className='flex overflow-hidden aspect-video'
                style={{
                  width: `calc((100% / ${calculateItemsPerRow(windowSize.width)}))`
                }}
              > 
                <EpisodeCard episode={episode}/>
              </Link>
            })}
        </div>
        {/* {JSON.stringify(activeSeason)} */}
        {/* <div
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
            {t('anime.generic.cardinalSeason', { n: season.number })} - {season.title}
          </span>
          {expanded ? <CaretDown size={24} /> : <CaretUp size={24} />}
        </div> */}
        {/* <UnmountClosed
          isOpened={expanded}
          theme={{ collapse: 'transition-[height] duration-300 mb-4' }}
        > */}
          {/* {season.AnimeEpisode.sort((a, b) => a.number - b.number).map((episode, index) => {
            return (
              <div
                className="flex flex-row w-full px-2 py-4 duration-300 cursor-pointer group bg-secondary last-of-type:rounded-b-md hover:bg-accent hover:text-secondary"
                key={`season.episode.${episode.id}`}
              >
                <Link href={`/episode/${episode.id}?seasonid=${season.id}`}>
                  <EpisodeCard episode={episode} />
                </Link>
              </div>
            )
          })} */}
        {/* </UnmountClosed> */}
      </div>

  )
}

export default Season
