import React from 'react'
import { useTranslation } from 'react-i18next'

import { getLocaleMetadata } from '@/services/anima/getMetadataFromMedia'

import Loading from '../General/Loading'
import AnimeCard from './AnimeCard'

type Props = {
  animes: Anima.RAW.Anime[] | Anima.API.SearchAnimes['data']
  alwaysShowInfo?: boolean
  animesPerRow?: number
  onHitBottom?: () => void
  hasMore?: boolean
  onAnimeSelect?: (anime: Anima.RAW.Anime) => void
}

function AnimeGrid({
  animes,
  alwaysShowInfo,
  animesPerRow,
  onHitBottom,
  hasMore,
  onAnimeSelect,
}: Props) {
  const { t } = useTranslation()
  const handleScroll = (e) => {
    if (!hasMore) return
    const bottom = e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight
    if (bottom) {
      onHitBottom?.()
    }
  }

  return (
    <div className="flex w-full">
      {/* {JSON.stringify(animes)} */}
        <div className="flex flex-wrap w-full gap-x-4">
          {animes.map((anime) => (
            <div
              key={anime.slug || anime.id}
              className="group flex aspect-[3/2] select-none flex-col py-2.5"
              style={{
                width: `calc(calc(100vw - 10px) / ${animesPerRow})`,
                minWidth: `calc(calc(100vw - 10px) / ${animesPerRow})`,
              }}
              itemID={anime.slug || String(anime.id)}
            >
              <AnimeCard anime={anime} showDetails={alwaysShowInfo} onClick={onAnimeSelect} />
              {alwaysShowInfo && (
                <span className="pt-1 text-xs font-medium line-clamp-2">
                  {getLocaleMetadata<Anima.RAW.Anime, Anima.RAW.AnimeMetadata>(anime)?.title ||
                    'No title'}
                </span>
              )}
            </div>
          ))}
          {/* // TODO: SWAP TEXT FOR SKELETON */}
          {hasMore && (
            <div className="flex flex-row items-center justify-center w-full">
              <Loading xs />
              <div className="flex items-center justify-center h-8 ml-2 font-semibold text-subtle">
                {t('loading_moreData')}
              </div>
            </div>
          )}
        </div>
    </div>
  )
}

export default AnimeGrid
