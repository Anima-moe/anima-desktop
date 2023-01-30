import { CaretDown, CaretUp } from 'phosphor-react'
import { useState } from 'react'
import { UnmountClosed } from 'react-collapse';
import { useTranslation } from 'react-i18next';
import EpisodeCard from '../Episode/EpisodeCard';

type Props = {
  season: Anima.RAW.Season
}

function Season({season}: Props) {
  const [expanded, setExpanded] = useState(false)
  const { t } = useTranslation()
  
  const onToggleExpand = () => {
    setExpanded(!expanded)
  }

  return <div className='mb-4'>
    <div 
      className={`w-full bg-tertiary hover:bg-subtle hover:text-white duration-300 px-4 py-2 ${ expanded ? 'rounded-t-md' : 'rounded-md'} cursor-pointer font-semibold justify-between flex flex-row  select-none`}
      onClick={onToggleExpand}
      onKeyDown={(e) => {
        if (e.code === 'Enter' || e.code === 'Space') {
          onToggleExpand()
        }
      }}
      role="button"
      tabIndex={0}
    >
      {t('anime_generic_season', {n: season.number})}
      { expanded ? <CaretDown size={24} /> : <CaretUp size={24} /> }
    </div>
    <UnmountClosed  
      isOpened={expanded} 
      theme={{ collapse: 'transition-[height] duration-300 mb-4' }}
    >
      {season.AnimeEpisode.sort((a,b)=> a.number - b.number).map((episode, index) => {
        return <div className='bg-secondary w-full flex flex-row last-of-type:rounded-b-md px-2 py-4 hover:bg-accent hover:text-secondary group duration-300 cursor-pointer' key={`season.episode.${episode.id}`}>
            <EpisodeCard episode={episode}/>
        </div>
      })}
    </UnmountClosed >
  </div>
}

export default Season