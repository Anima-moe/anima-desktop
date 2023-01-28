import { getLocaleMetadata } from '@/services/anima/getMetadataFromMedia'
import { motion } from 'framer-motion'

type Props = {
  anime: Anima.RAW.Anime
  disabled?: boolean
  noHover?: boolean
  onClick?: () => void
}

const cardVariants = {
  initial: {
    y: 0,
    transition: {
      duration: .3,
      ease: 'easeOut'
    }
  },
  hover: {
    y: '-10px',
    transition: {
      duration: .3,
      type: 'spring',
      stiffness: 500,
      damping: 60,
      mass: 1,
      ease: 'easeInOut'
    }
  }
}

const contentVariants = {
  initial: {
    opacity: 0,
    y: 10
  },
  hover: {
    opacity: 1,
    y: 0,
    transition: {
      duration: .3,
      ease: 'easeOut'
    }
  }
}

const shadeVariants = {
  initial: {
    opacity: 0
  },
  hover: {
    opacity: 1,
    transition: {
      duration: .3,
      type: 'tween',
      ease: 'easeOut'
    }
  }
}

function AnimeCard({anime, disabled, noHover, onClick}: Props) {
  return (
    <motion.div 
      className='aspect-[2/3] w-full bg-red-600 overflow-hidden rounded-md select-none' 
      style={{
        backgroundColor: '#1a1a1a',
        background: `url('${anime.cover}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        cursor: disabled ? 'initial' : 'pointer'
      }}
      whileHover={disabled ? 'initial' : 'hover'}
      animate="initial"
      variants={cardVariants}
    >
        {noHover ?? <motion.div 
          className='flex flex-col w-full overflow-hidden text-left whitespace-nowrap absolute left-0 bottom-0 p-4 bg-gradient-to-t from-[rgba(16,16,16,.9)] to-transparent h-full items-start justify-end pointer-events-none opacity-0'
          variants={shadeVariants}
        >
          <motion.h6 
            className='text-sm font-semibold text-ellipsis w-full overflow-hidden translate-y-10'
            variants={contentVariants}
          >
            {getLocaleMetadata(anime).title}
          </motion.h6>
          <motion.span 
            className='w-full flex text-xs text-subtle'
            variants={contentVariants}
          >
            {/* {getLocaleMetadata(anime)..split('-')[0]} • { t(qntd_temporadas > 1 ? 'anime_generic_seasons' : 'anime_generic_season', {n: qntd_temporadas}) } */}
          </motion.span>
          {/* { episodes_count ? <span className={`text-md text-gray-500 flex items-center`}>
          {t('anime_generic_seasons', { n: launchDate || 0 })} • {episodes_count || '?'} Episódio(s)</span> : <> </> } */}
        </motion.div> }
    </motion.div>
  )
}

export default AnimeCard