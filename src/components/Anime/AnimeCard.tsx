import { useTranslation } from 'react-i18next'

import { motion } from 'framer-motion'
import Link from 'next/link'

import { getLocaleMetadata } from '@/services/anima/getMetadataFromMedia'

type Props = {
  anime: Anima.RAW.Anime
  disabled?: boolean
  noHover?: boolean
  onClick?: (anime: Anima.RAW.Anime) => void
}

const cardVariants = {
  initial: {
    y: 0,
    transition: {
      duration: 0.3,
      ease: 'easeOut',
    },
  },
  hover: {
    y: '-10px',
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

const contentVariants = {
  initial: {
    opacity: 0,
    y: 10,
  },
  hover: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: 'easeOut',
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

function AnimeWrapper({
  disabled,
  children,
  url,
}: {
  disabled?: boolean
  children?: React.ReactNode
  url?: string
}) {
  return <>{disabled || !url ? children : <Link href={url}>{children}</Link>}</>
}

function AnimeCard({ anime, disabled, noHover, onClick }: Props) {
  const { t } = useTranslation()

  return (
    <AnimeWrapper url={`/anime/${anime.id}`} disabled={onClick !== undefined || disabled}>
      <motion.div
        className="relative w-full aspect-[2/3] overflow-hidden bg-center bg-cover rounded-md select-none "
        style={{
          backgroundColor: '#212121',
          backgroundImage: `url('${anime.cover}')`,
          cursor: disabled ? 'initial' : 'pointer',
        }}
        whileHover={disabled ? 'initial' : 'hover'}
        animate="initial"
        variants={cardVariants}
        onClick={() => {
          onClick?.(anime)
        }}
      >
        {noHover ?? (
          <motion.div
            className="pointer-events-none absolute bottom-0 flex w-full flex-col items-start justify-end overflow-hidden whitespace-nowrap bg-gradient-to-t from-[rgba(16,16,16,.9)] to-transparent p-4 text-left opacity-0"
            variants={shadeVariants}
          >
            <motion.h6
              className="w-full overflow-hidden text-sm font-semibold translate-y-10 text-ellipsis"
              variants={contentVariants}
            >
              {getLocaleMetadata<Anima.RAW.Anime, Anima.RAW.AnimeMetadata>(anime)?.title ||
                'Unknown title'}
            </motion.h6>
            <motion.span className="flex w-full text-xs text-white/50" variants={contentVariants}>
              {`${t(
                anime.AnimeSeason.length > 1 ? 'anime_generic_seasons' : 'anime_generic_season',
                { n: anime.AnimeSeason.length }
              )}`}
            </motion.span>
          </motion.div>
        )}
      </motion.div>
    </AnimeWrapper>
  )
}

export default AnimeCard
