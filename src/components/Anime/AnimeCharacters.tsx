import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { AnimatePresence, motion } from 'framer-motion'

import { AnilistCharacter } from '@/services/anilist/anilistService'

type Props = {
  characters: AnilistCharacter[]
}

function AnimeCharactersCard({character}: {character: AnilistCharacter}) {
  const [persona, setpersona] = useState<'character' | 'voiceActor'>('character')
  const japaneseVA = character.voiceActors.filter( va => va.languageV2 === 'Japanese')[0]
  return <div 
    className='aspect-[2/3] w-full relative'             
    onMouseEnter={()=>{
      if (!japaneseVA) return

      setpersona('voiceActor')
    }} 
    onMouseLeave={()=>{
      setpersona('character')
    }}
  >
    <AnimatePresence initial={false}>
      {persona === 'character' ? (
        <motion.div 
          className='w-full h-full absolute top-0 left-0 rounded-md overflow-hidden cursor-help' 
          initial={{ rotateY: 180, backfaceVisibility: 'hidden' }}
          animate={{ rotateY: 0, backfaceVisibility: 'hidden' }}
          exit={{ rotateY: -180, backfaceVisibility: 'hidden' }}
          transition= {{
            duration: .3,
            type: 'spring',
            stiffness: 500,
            damping: 60,
            mass: 1,
          }}
          key={character.node.id}
        >
          {character.node.image && <img src={persona === 'character' ? character.node.image.large : japaneseVA.image.large} className='w-full h-full object-cover' /> }
          <p className='absolute bottom-0 left-0 flex flex-col w-full overflow-hidden whitespace-nowrap bg-gradient-to-t from-primary'>
            <span className='text-sm text-ellipsis px-2 pt-4' >{character.node.name.full }</span>
            <span className='text-xs text-ellipsis text-white text-opacity-50 overflow-hidden px-2 pb-2' > {character.node.name.native} </span>
          </p>
        </motion.div> 
      ) : (
          <motion.div 
            className='w-full h-full absolute top-0 left-0 rounded-md overflow-hidden [backface-visibility: hidden]  cursor-help' 
            initial={{ rotateY: 180, backfaceVisibility: 'hidden' }}
            animate={{ rotateY: 0, backfaceVisibility: 'hidden' }}
            exit={{ rotateY: -180, backfaceVisibility: 'hidden' }}
            transition={{ duration: .3 }}
          >
            {japaneseVA.image && <img src={japaneseVA.image.large} className='object-cover' /> }
            <p className='absolute bottom-0 left-0 flex flex-col w-full overflow-hidden whitespace-nowrap bg-gradient-to-t from-secondary'>
              <span className='text-sm text-ellipsis px-2 pt-4' >{japaneseVA.name.full }</span>
              <span className='text-xs text-ellipsis text-white text-opacity-50 overflow-hidden px-2 pb-2' >{japaneseVA.name.native}</span>
            </p>
          </motion.div>
        )}
   </AnimatePresence>
  </div>
}

function AnimeCharacters({characters}: Props) {
  const [expanded, setExpanded] = useState(false)
  const { t } = useTranslation()

  return <div className='mt-8'>
    <h3 className='mt-4 mb-2 font-bold'>{t('anime_heading_characters')}</h3>
    <div className={`w-full ${expanded ? 'h-full' : 'h-64' } overflow-hidden relative transition-all duration-300 mb-4`}>
      <div className='grid grid-cols-8 mt-1.5 w-full gap-4 mb-2'>
          {characters.map((character, index) => {
            return  <AnimeCharactersCard character={character} key={`character.${index}`}/>
          })}
      </div>
      {!expanded ? (
        <div className='bg-gradient-to-t from-primary pb-2 px-2 h-full absolute bottom-0 w-full'>
          <span className='font-semibold cursor-pointer absolute bottom-2 select-none' onClick={()=>{setExpanded(true)}}>{t('cta_seeMore')}</span>
        </div>
      ) : (
        <span className='font-semibold cursor-pointer select-none' onClick={()=>{setExpanded(false)}}>{t('cta_seeLess')}</span>
      )}
    </div>
  </div>
}

export default AnimeCharacters