import { motion } from 'framer-motion'
import { getLocaleMetadata } from '@/services/anima/getMetadataFromMedia'
import clsx from 'clsx'
import React from 'react'
import { useAtom } from 'jotai';
import { playerStreamConfig } from '@/stores/atoms';
import Link from 'next/link'

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
      duration: .3,
      ease: 'easeOut'
    }
  },
  hover: {
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
    opacity: 1,
  },
  hover: {
    opacity: 1,
    transition: {
      duration: .3,
      ease: 'easeOut'
    }
  }
}

const shadeVariants = {
  initial: {
    opacity: .6
  },
  hover: {
    opacity: .9,
    transition: {
      duration: .3,
      type: 'tween',
      ease: 'easeOut'
    }
  }
}


function EpisodeFatCard({episode, active, link}: Props) {
  const [streamConfig, setStreamConfig] = useAtom(playerStreamConfig)

  const beautyNumber = (number: number) => {
    if (number < 10) return `0${number}`
    return number
  }

  const className = clsx({
    'flex flex-col w-full bg-cover bg-center bg-no-repeat relative rounded-md justify-end p-4 overflow-hidden select-none transition-all duration-300 mt-2': true,
    'cursor-pointer h-16': !active,
    'border border-accent cursor-not-allowed h-32': active
  })
  return <Link href={active ? '#' : `/episode/${episode.id}?season=${episode.season_id}`} >
    <motion.div 
      className={className} 
      style={{backgroundImage: `url('${episode.thumbnail}')`}}
      variants={activeCardVariants}
      initial={ 'initial'}
      whileHover='hover'
      data-episode-id={episode.id}
    >
    
      <motion.div 
        variants={shadeVariants}
        className='bg-gradient-to-r from-black to-transparent absolute top-0 left-0 w-[100%] h-[100%] z[-1]' 
      />
      <motion.div 
        className='z-[0]'
        variants={contentVariants}
      >
        <div className='flex flex-row items-center'>
          <span className={`${active ? 'bg-accent text-primary' : 'bg-primary text-accent' } text-xs px-1.5 aspect-square rounded-md mr-1.5 flex items-center justify-center`}>{beautyNumber(episode.number) || '?'}</span>
          <h1 className={`font-semibold text-xs overflow-hidden w-full line-clamp-1 text-ellipsis ${active ? 'opacity-100' : 'opacity-90'}`}>{getLocaleMetadata<Anima.RAW.Episode, Anima.RAW.EpisodeMetadata>(episode)?.title || 'Unknown'}</h1>
        </div>
      </motion.div>

    </motion.div>
    </Link>
}

export default EpisodeFatCard