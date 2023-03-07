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
    scale: 1,
    transition: {
      duration: 0.3,
      ease: 'easeOut',
    },
  },
  hover: {
    scale: .98,
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
          className="episde-card aspect-video relative w-full rounded-md bg-tertiary bg-cover bg-center overflow-hidden"
          style={{ backgroundImage: `url('${playerHead?.AnimeEpisode?.thumbnail}')` }}
        >
          <motion.div 
          variants={shadeVariants}
          className='pointer-events-none absolute left-0 bottom-0 flex h-full w-full flex-col items-start justify-end overflow-hidden whitespace-nowrap bg-gradient-to-t from-[rgba(16,16,16,.9)] to-transparent px-4 py-2.5 text-left opacity-0'>
            <motion.div className="flex w-full flex-col justify-center overflow-hidden text-ellipsis">
              <h2 className="flex text-md font-semibold w-full text-ellipsis overflow-hidden">
                {getLocaleMetadata<Anima.RAW.Anime, Anima.RAW.AnimeMetadata>(playerHead?.AnimeEpisode?.AnimeSeason?.Anime)?.title ||
                  'Anime title'}
              </h2>
              <p className="text-sm text-white text-opacity-60 line-clamp-5 group-hover:text-secondary">
                S{playerHead.AnimeEpisode.AnimeSeason.number}E{playerHead.AnimeEpisode.number} • {getLocaleMetadata<Anima.RAW.Episode, Anima.RAW.EpisodeMetadata>(playerHead?.AnimeEpisode)?.title ||
                  'Episode title'}
              </p>
              {playerHead.duration - playerHead.head > 90 ? (
                <div className='w-full h-2 bg-white/20 rounded-sm mt-3 overflow-hidden' >
                  <div 
                    className='h-full bg-accent'
                    style={{width: `${~~((playerHead.head/playerHead.duration)*100)}%`}} 
                  />
                </div>
                ) : (
                <div className='absolute top-2.5 right-2.5 bg-white/20 h-8 w-8 rounded-full flex items-center justify-center text-accent'>
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
