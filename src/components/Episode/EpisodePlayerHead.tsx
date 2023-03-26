import { motion } from 'framer-motion'
import Link from 'next/link'
import { Check } from 'phosphor-react'

import { getLocaleMetadata } from '@/services/anima/getMetadataFromMedia'

type Props = {
  playerHead: Anima.RAW.UserPlayerHead
}


const cardVariants = {
  initial: {
    y: 0,
    zIndex: 0,
    transition: {
      duration: 0.3,
      ease: 'easeOut',
    },
  },
  hover: {
    zIndex: 999,
    y: '-5px',
    transition: {
      duration: 0.3,
      type: 'spring',
      stiffness: 500,
      damping: 60,
      mass: 1,
      ease: 'easeInOut',
    },
  },
}

const shadeVariants = {
  initial: {
    opacity: 0,
  },
  hover: {
    opacity: 1,
    transition: {
      duration: 0.3,
      type: 'tween',
      ease: 'easeOut',
    },
  },
}


function EpisodePlayerHead({ playerHead }: Props) {

  return (
      <motion.div 
        className="flex flex-col cursor-pointer"  
        whileHover={'hover'}
        animate="initial"
        variants={cardVariants}>
        <Link href={`/episode/${playerHead?.AnimeEpisode?.id}?seasonid=${playerHead?.AnimeEpisode?.season_id}`}>
          
        <motion.div
          className="relative w-full overflow-hidden bg-center bg-cover rounded-md episde-card aspect-video bg-tertiary"
          style={{ backgroundImage: `url('${playerHead?.AnimeEpisode?.thumbnail}')` }}
        >
          <motion.div 
          variants={shadeVariants}
          className='pointer-events-none absolute left-0 bottom-0 flex h-full w-full flex-col items-start justify-end overflow-hidden whitespace-nowrap bg-gradient-to-t from-[rgba(16,16,16,.9)] to-transparent px-4 py-2.5 text-left opacity-0'>
            <motion.div className="flex flex-col justify-center w-full overflow-hidden text-ellipsis">
              <h2 className="flex w-full overflow-hidden font-semibold text-md text-ellipsis">
                {getLocaleMetadata<Anima.RAW.Anime, Anima.RAW.AnimeMetadata>(playerHead?.AnimeEpisode?.AnimeSeason?.Anime)?.title ||
                  'Anime title'}
              </h2>
              <p className="relative w-full overflow-hidden text-sm text-white text-opacity-60 line-clamp-5 group-hover:text-secondary text-ellipsis">
                S{playerHead.AnimeEpisode.AnimeSeason.number}E{playerHead.AnimeEpisode.number} • {getLocaleMetadata<Anima.RAW.Episode, Anima.RAW.EpisodeMetadata>(playerHead?.AnimeEpisode)?.title ||
                  'Episode title'}
              </p>
              {playerHead.duration - playerHead.head > 180 ? (
                <div className='w-full h-2 mt-3 overflow-hidden rounded-sm bg-white/20' >
                  <div 
                    className='h-full bg-accent'
                    style={{width: `${~~((playerHead.head/playerHead.duration)*100)}%`}} 
                  />
                </div>
                ) : (
                <div className='absolute top-2.5 right-2.5 bg-primary/80 h-8 w-8 rounded-full flex items-center justify-center text-accent'>
                  <Check size={24} />
                </div>
              )}
            </motion.div>
          </motion.div>
        </motion.div>
        </Link>
      </motion.div>
  )
}

export default EpisodePlayerHead
