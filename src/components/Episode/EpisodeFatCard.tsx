import { motion } from 'framer-motion'
import { getLocaleMetadata } from '@/services/anima/getMetadataFromMedia'
import clsx from 'clsx'
import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'

type Props = {
  episode: Anima.RAW.Episode
  playerHead?: number
  duration?: number
  active?: boolean
  link: string
}

const cardVariants = {
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


function EpisodeFatCard({episode, active, link}: Props) {
  const router = useRouter()
  const beautyNumber = (number: number) => {
    if (number < 10) return `0${number}`
    return number
  }

  const className = clsx({
    'flex flex-col w-full min-h-[10rem] aspect-video bg-cover bg-center bg-no-repeat relative mb-4 rounded-md justify-end p-4 overflow-hidden select-none': true,
    'cursor-pointer': !active,
    'border-2 border-tertiary': active
  })
  return <motion.div 
      className={className} 
      style={{backgroundImage: `url('${episode.thumbnail}')`}}
      variants={active ? activeCardVariants : cardVariants}
      initial={ active ? 'hover' : 'initial'}
      whileHover='hover'
      onClick={() => router.push(link)}
    >
    
      <motion.div 
        variants={shadeVariants}
        className='bg-gradient-to-t from-primary to-transparent absolute top-0 left-0 w-[100%] h-[100%] bg-opacity-40 z[-1]' 
      />
      <motion.div 
        className='z-[0]'
        variants={contentVariants}
      >
        <div className='flex flex-row mb-1.5'>
          <span className='bg-primary text-accent px-2 rounded-md mr-1.5 flex items-center justify-center'>{beautyNumber(episode.number) || '?'}</span>
          {/* {JSON.stringify(episode)} */}
          <h1 className='font-semibold text-lg overflow-hidden w-full line-clamp-1 text-ellipsis'>{getLocaleMetadata<Anima.RAW.Episode, Anima.RAW.EpisodeMetadata>(episode)?.title || 'Unknown'}</h1>
        </div>
        <p className='text-xs text-white text-opacity-60 overflow-hidden w-full text-ellipsis line-clamp-3'>{getLocaleMetadata<Anima.RAW.Episode, Anima.RAW.EpisodeMetadata>(episode)?.synopsis || 'No synopsis'}</p>
        {JSON.stringify(episode.EpisodeMetadata)}
      </motion.div>

    </motion.div>
}

export default EpisodeFatCard