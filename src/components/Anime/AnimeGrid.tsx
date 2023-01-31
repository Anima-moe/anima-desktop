import { getLocaleMetadata } from '@/services/anima/getMetadataFromMedia';
import React from 'react'
import { Scrollbars } from 'react-custom-scrollbars';
import { useTranslation } from 'react-i18next';
import Loading from '../General/Loading';
import AnimeCard from './AnimeCard';

type Props = {
  animes: Anima.RAW.Anime[]
  alwaysShowInfo?: boolean
  animesPerRow?: number
  onHitBottom?: () => void
  hasMore?: boolean
}

function AnimeGrid({animes, alwaysShowInfo, animesPerRow, onHitBottom, hasMore}: Props) {
  const { t } = useTranslation()
  const handleScroll = (e) => {
    if (!hasMore) return
    const bottom = e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
    if (bottom) {
      onHitBottom?.()
    }
  }

  return (
    <div className='flex w-full h-full'>
      {/* {JSON.stringify(animes)} */}
      <Scrollbars 
        autoHide 
        hideTracksWhenNotNeeded 
        universal
        onScroll={handleScroll}
      >
        <div className='flex w-full h-full flex-wrap'>
          {animes.map(anime => (
            <div 
            key={anime.external_id} 
            className='aspect-[3/2] group py-2.5 mx-2 flex flex-col select-none'
            style={{
              width: `calc(calc(100vw - calc(1vw + 48px) - 16px - 8rem) / ${animesPerRow})`,
              minWidth: `calc(calc(100vw - calc(1vw + 48px) - 16px - 8rem) / ${animesPerRow})`
            }}
            itemID={anime.external_id}
          >
            <AnimeCard 
              anime={anime}
              noHover={alwaysShowInfo}
            />
            {alwaysShowInfo && <span className='pt-1 text-sm font-medium'>
              {getLocaleMetadata<Anima.RAW.Anime, Anima.RAW.AnimeMetadata>(anime)?.title || 'No title'}
            </span>}
          </div> 
          ))}
        {/* // TODO: SWAP TEXT FOR SKELETON */}
        {hasMore && (
          <div className='flex flex-row w-full items-center justify-center'>
              <Loading xs/>
              <div className='h-8 flex items-center justify-center text-subtle font-semibold ml-2'>{t('loading_moreData')}</div>
          </div>
        )}
        </div>
      </Scrollbars>
    </div>
  )
}

export default AnimeGrid