import React from 'react'
import { Scrollbars } from 'react-custom-scrollbars'
import { useTranslation } from 'react-i18next'

import { getLocaleMetadata } from '@/services/anima/getMetadataFromMedia'

import Loading from '../General/Loading'
import AnimeCard from './AnimeCard'

type Props = {
  animes: Anima.RAW.Anime[]
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
    <div className="flex h-full w-full">
      {/* {JSON.stringify(animes)} */}
      <Scrollbars autoHide hideTracksWhenNotNeeded universal onScroll={handleScroll}>
        <div className="flex h-full w-full flex-wrap">
          {animes.map((anime) => (
            <div
              key={anime.slug}
              className="group mx-2 flex aspect-[3/2] select-none flex-col py-2.5"
              style={{
                width: `calc(calc(100vw - 16px - 8rem) / ${animesPerRow})`,
                minWidth: `calc(calc(100vw - 16px - 8rem) / ${animesPerRow})`,
              }}
              itemID={anime.slug}
            >
              <AnimeCard anime={anime} noHover={alwaysShowInfo} onClick={onAnimeSelect} />
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
            <div className="flex w-full flex-row items-center justify-center">
              <Loading xs />
              <div className="ml-2 flex h-8 items-center justify-center font-semibold text-subtle">
                {t('loading_moreData')}
              </div>
            </div>
          )}
        </div>
      </Scrollbars>
    </div>
  )
}

export default AnimeGrid
