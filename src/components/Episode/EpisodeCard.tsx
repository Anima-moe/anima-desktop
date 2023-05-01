import dayjs from 'dayjs'
import { t } from 'i18next'

import { getLocaleMetadata } from '@/services/anima/getMetadataFromMedia'
import * as Tooltip from '@radix-ui/react-tooltip'
type Props = {
  episode: Anima.RAW.Episode
  playerHead?: Anima.RAW.UserPlayerHead
}

const beautyNumber = (number: number) => {
  if (number < 10) return `0${number}`
  return number
}

function EpisodeCard({ episode, playerHead }: Props) {

  return (
    <Tooltip.Provider delayDuration={200}>
    <Tooltip.Root>
      <Tooltip.Trigger asChild>
        <div 
          className='flex flex-col w-full h-full gap-1 px-2 whitespace-nowrap text-ellipsis'
        >
          <div
            className={'episode-card aspect-video rounded-md bg-tertiary bg-cover bg-center whitespace-wrap w-full h-full relative'}
            style={{
              backgroundImage: `url('${episode.thumbnail}')`,
              // width: `calc(calc(80vw - 4rem - 2rem - calc(1rem * ${calculateItemsPerRow(windowSize.width) - 1}))/${calculateItemsPerRow(windowSize.width)})`
            }}
          >
            {playerHead && (
              <div className='absolute w-11/12 h-3 overflow-hidden -translate-x-1/2 rounded-sm bottom-2 left-1/2 bg-secondary/50' >
                <div 
                  className='h-full rounded-sm bg-accent'
                  style={{width: `${~~((playerHead.head/playerHead.duration)*100)}%`}} 
                />
              </div>
            )}
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
            className="max-w-[350px] bg-tertiary border border-subtle/10 rounded shadow-md p-4 overflow-hidden relative" 
            side='bottom'
            sideOffset={-50} 
            collisionPadding={10}
          >

            <span className='z-[2] relative text-white/40 text-sm'>{t('anime.generic.synopsis')}:</span>
            <p className='text-xs text-white/90 group-hover:text-secondary z-[2] relative mt-1.5 mb-2'>
              {getLocaleMetadata<Anima.RAW.Episode, Anima.RAW.EpisodeMetadata>(episode)?.synopsis ||
                'Missing synopsis'}
            </p>
            {playerHead && <>
              <span className='z-[2] relative text-white/40 text-sm'>{t('anime.generic.progress')}:</span>
              <div className='z-[2] relative w-full h-3 rounded-sm bg-white/20 mt-1.5' >
                <div 
                  className='relative h-full rounded-sm bg-accent'
                  style={{width: `${~~((playerHead.head/playerHead.duration)*100)}%`}} 
                />
              </div>
              <span className='relative z-[2] text-xs text-subtle'>{t('generic.date.format', { day: dayjs(playerHead.updated_at).date(), month: dayjs(playerHead.updated_at).month() + 1, year: dayjs(playerHead.updated_at).year() })}</span>
            </>}
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>

  )
}

export default EpisodeCard
