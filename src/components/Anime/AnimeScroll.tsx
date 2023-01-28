import AnimeCard from '@/components/Anime/AnimeCard'
import { PagedScroller } from 'react-paged-scroller'

import { CaretDoubleLeft, CaretLeft, CaretRight } from 'phosphor-react'

import { getLocaleMetadata } from '../../services/anima/getMetadataFromMedia';


function onWheel(ev: React.WheelEvent): void {
  ev.preventDefault();
  const isThouchpad = Math.abs(ev.deltaX) !== 0 || Math.abs(ev.deltaY) < 15;

  if (isThouchpad) {
    ev.stopPropagation();
    return;
  }

  if (ev.deltaY < 0) {
    ev.currentTarget
  } else if (ev.deltaY > 0) {
    ev.currentTarget.scrollLeft += 100;
  }
}


type Props = {
  animesPerScreen: number
  animes: Anima.RAW.Anime[]
  alwaysShowInfo?: boolean
}

function AnimeScroll({animes, animesPerScreen, alwaysShowInfo}: Props) {
    // @ts-expect-error
    return <PagedScroller 
      enableDrag 
      itemGap='8px' 
      showArrows 
      scrollLeftButton={
        <div className='left-0 top-1/2 absolute -translate-y-1/2'>
          <div className='w-10 h-10 flex items-center justify-center rounded-md border border-tertiary bg-secondary hover:bg-black hover:text-accent cursor pointer duration-300'>
            <CaretLeft size={22}/>
          </div>
        </div>
      }
      scrollRightButton={
        <div className='left-0 top-1/2 absolute -translate-y-1/2'>
          <div className='w-10 h-10 flex items-center justify-center rounded-md border border-tertiary bg-secondary hover:bg-black hover:text-accent cursor pointer duration-300'>
            <CaretRight size={22}/>
          </div>
        </div>
      }
      returnToStartButton={
        <div className='left-0 top-1/2 absolute -translate-y-1/2'>
          <div className='w-10 h-10 flex items-center justify-center rounded-md border border-tertiary bg-secondary hover:bg-black hover:text-accent cursor pointer duration-300'>
            <CaretDoubleLeft size={22}/>
          </div>
        </div>
      }
    >
    {animes.map(anime => { 
        return <div 
          key={anime.external_id} 
          className='aspect-[3/2] group py-2.5 mx-2 flex flex-col select-none'
          style={{
            width: `calc(calc(100vw - calc(1vw + 48px) - 16px) / ${animesPerScreen})`,
            minWidth: `calc(calc(100vw - calc(1vw + 48px) - 16px) / ${animesPerScreen})`
          }}
          onWheel={onWheel}
          itemID={anime.external_id}
        >
          <AnimeCard 
            anime={anime}
            noHover={alwaysShowInfo}
          />
          {alwaysShowInfo && <span className='pt-1 text-sm font-medium'>
            {getLocaleMetadata(anime)?.title || 'No title'}
          </span>}
        </div>
      })}
    </PagedScroller>

}

export default AnimeScroll