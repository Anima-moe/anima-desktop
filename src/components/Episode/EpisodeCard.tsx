import { t } from 'i18next'

import { getLocaleMetadata } from '@/services/anima/getMetadataFromMedia'
import * as Tooltip from '@radix-ui/react-tooltip'
type Props = {
  episode: Anima.RAW.Episode
}

const beautyNumber = (number: number) => {
  if (number < 10) return `0${number}`
  return number
}

function EpisodeCard({ episode }: Props) {
  
  return (
    <Tooltip.Provider delayDuration={200}>
    <Tooltip.Root>
      <Tooltip.Trigger asChild>
        <div 
          className='flex flex-col w-full h-full gap-1 px-2 whitespace-nowrap text-ellipsis'
        >
          <div
            className={'episode-card aspect-video rounded-sm bg-tertiary bg-cover bg-center whitespace-wrap w-full h-full'}
            style={{
              backgroundImage: `url('${episode.thumbnail}')`,
              // width: `calc(calc(80vw - 4rem - 2rem - calc(1rem * ${calculateItemsPerRow(windowSize.width) - 1}))/${calculateItemsPerRow(windowSize.width)})`
            }}
          >
          </div>
          <div className='flex flex-col justify-center'>
            <h2 className='flex w-full mb-2 overflow-hidden text-sm text-ellipsis'>
              <span className='flex items-center justify-center text-xs text-white/40'>
                E{beautyNumber(episode.number) || '?'}
              </span>
              <span className='mx-1.5 text-xs white/40 h-full flex items-center'>•</span>
              {getLocaleMetadata<Anima.RAW.Episode, Anima.RAW.EpisodeMetadata>(episode)?.title ||
              'Unknown title'}
            </h2>
          </div>
        </div>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content 
            className="max-w-[350px] bg-tertiary border border-subtle rounded shadow-md p-4 overflow-hidden relative" 
            side='bottom' 
            sideOffset={0} 
            collisionPadding={10}
          >
            <div className='absolute inset-0 w-full h-full bg-center bg-cover blur-sm z-[0]' style={{backgroundImage: `url('${episode.thumbnail}')`}} />
            <div className='absolute inset-0 w-full h-full bg-center bg-cover blur-sm z-[1] from-secondary to-secondary/80 bg-gradient-to-t' />
            <span className='z-[2] relative text-white/40 text-sm'>{t('anime.generic.synopsis')}:</span>
            <p className='text-xs text-white/90 group-hover:text-secondary z-[2] relative mt-2'>
              {getLocaleMetadata<Anima.RAW.Episode, Anima.RAW.EpisodeMetadata>(episode)?.synopsis ||
                'Missing synopsis'}
            </p>
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>

  )
}

export default EpisodeCard
