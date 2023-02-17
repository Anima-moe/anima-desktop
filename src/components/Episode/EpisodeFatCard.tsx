import React from 'react'

import clsx from 'clsx'
import { motion } from 'framer-motion'
import Link from 'next/link'

import { getLocaleMetadata } from '@/services/anima/getMetadataFromMedia'

type Props = {
  episode: Anima.RAW.Episode
  playerHead?: number
  duration?: number
  active?: boolean
  link: string
}

const activeCardVariants = {
  initial: {
    transition: {
      duration: 0.3,
      ease: 'easeOut',
    },
  },
  hover: {
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
    opacity: 1,
  },
  hover: {
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: 'easeOut',
    },
  },
}

const shadeVariants = {
  initial: {
    opacity: 0.6,
  },
  hover: {
    opacity: 0.9,
    transition: {
      duration: 0.3,
      type: 'tween',
      ease: 'easeOut',
    },
  },
}

function EpisodeFatCard({ episode, active, link }: Props) {
  const beautyNumber = (number: number) => {
    if (number < 10) return `0${number}`
    return number
  }

  const className = clsx({
    'flex flex-col w-full bg-cover bg-center bg-no-repeat relative rounded-md justify-end p-4 overflow-hidden select-none transition-all duration-300 mt-2':
      true,
    'cursor-pointer h-16': !active,
    'border border-accent cursor-not-allowed h-32': active,
  })
  return (
    <Link
      href={active ? '#' : `/episode/${episode.id}?season=${episode.season_id}`}
      prefetch={false}
      replace={true}
    >
      <motion.div
        className={className}
        style={{ backgroundImage: `url('${episode.thumbnail}')` }}
        variants={activeCardVariants}
        initial={'initial'}
        whileHover="hover"
        data-episode-id={episode.id}
      >
        <motion.div
          variants={shadeVariants}
          className="z[-1] absolute top-0 left-0 h-[100%] w-[100%] bg-gradient-to-r from-black to-transparent"
        />
        <motion.div className="z-[0]" variants={contentVariants}>
          <div className="flex flex-row items-center">
            <span
              className={`${
                active ? 'bg-accent text-primary' : 'bg-primary text-accent'
              } mr-1.5 flex aspect-square items-center justify-center rounded-md px-1.5 text-xs`}
            >
              {beautyNumber(episode.number) || '?'}
            </span>
            <h1
              className={`w-full overflow-hidden text-ellipsis text-xs font-semibold line-clamp-1 ${
                active ? 'opacity-100' : 'opacity-90'
              }`}
            >
              {getLocaleMetadata<Anima.RAW.Episode, Anima.RAW.EpisodeMetadata>(episode)?.title ||
                'Unknown'}
            </h1>
          </div>
        </motion.div>
      </motion.div>
    </Link>
  )
}

export default EpisodeFatCard
