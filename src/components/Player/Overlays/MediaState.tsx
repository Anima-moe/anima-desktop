import * as React from 'react'

import Loading from '@/components/General/Loading'

interface IPlayerMediaStateProps {
  localizedAnimeTitle: string
  localizedEpisodeTitle: string
  episodeNumber: number
  seasonNumber: number
}

const PlayerMediaInfo: React.FunctionComponent<IPlayerMediaStateProps> = ({localizedAnimeTitle: anime, localizedEpisodeTitle: episode, episodeNumber, seasonNumber}) => {
  return <div 
    className='z-[2] media-can-play:pointer-events-none'
  >
    {/* YOU'RE WATCHING */}
    <div className='flex flex-col w-full h-full overflow-hidden whitespace-nowrap text-ellipsis'>
      <h1 className='text-xl font-semibold'>{anime}</h1>
      <h2 className='flex text-sm gap-x-2 opacity-70'>
        <span>S{seasonNumber}E{episodeNumber} </span>
        <span>•</span>
        {episode}
      </h2>
    </div>
  </div>
}

export default PlayerMediaInfo
