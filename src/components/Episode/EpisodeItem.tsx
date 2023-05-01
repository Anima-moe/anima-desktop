import { motion } from 'framer-motion'
import Link from 'next/link'
import { Check } from 'phosphor-react'

import { getLocaleMetadata } from '@/services/anima/getMetadataFromMedia'

type Props = {
  episode: Anima.RAW.Episode
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


function EpisodeItem({ episode }: Props) {

  return (
      <motion.div 
        className="flex flex-col cursor-pointer"  
        whileHover={'hover'}
        animate="initial"
        variants={cardVariants}>
        <Link href={`/episode/${episode?.id}?seasonid=${episode?.season_id}`}>
          
        <motion.div
          className="relative w-full overflow-hidden bg-center bg-cover rounded-md episde-card aspect-video bg-tertiary"
          style={{ backgroundImage: `url('${episode?.thumbnail}')` }}
        >
          <motion.div 
          variants={shadeVariants}
          className='pointer-events-none absolute left-0 bottom-0 flex h-full w-full flex-col items-start justify-end overflow-hidden whitespace-nowrap bg-gradient-to-t from-[rgba(16,16,16,.9)] to-transparent px-4 py-2.5 text-left opacity-0'>
            <motion.div className="flex flex-col justify-center w-full overflow-hidden text-ellipsis">
              <h6>{getLocaleMetadata<Anima.RAW.Anime, Anima.RAW.AnimeMetadata>(episode.AnimeSeason.Anime)?.title}</h6>
              <p className="relative w-full overflow-hidden text-sm text-white text-opacity-60 group-hover:text-secondary text-ellipsis">
                E{episode.number} • {getLocaleMetadata<Anima.RAW.Episode, Anima.RAW.EpisodeMetadata>(episode)?.title ||
                  'Episode title'}
              </p>
            </motion.div>
          </motion.div>
        </motion.div>
        </Link>
      </motion.div>
  )
}

export default EpisodeItem
