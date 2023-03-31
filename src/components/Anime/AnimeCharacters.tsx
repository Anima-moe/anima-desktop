import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { AnimatePresence, motion } from 'framer-motion'

import { AnilistCharacter } from '@/services/anilist/anilistService'

type Props = {
  characters: AnilistCharacter[]
}

function AnimeCharactersCard({ character }: { character: AnilistCharacter }) {
  const [persona, setpersona] = useState<'character' | 'voiceActor'>('character')
  const japaneseVA = character.voiceActors.filter((va) => va.languageV2 === 'Japanese')[0]
  return (
    <div
      className="relative w-full"
      onMouseEnter={() => {
        if (!japaneseVA) return

        setpersona('voiceActor')
      }}
      onMouseLeave={() => {
        setpersona('character')
      }}
    >
      <AnimatePresence initial={false}>
        {/* {persona === 'character' ? (+ */}
          <motion.div
            className="flex w-full h-full p-1 overflow-hidden"
            initial={{ rotateY: 180, backfaceVisibility: 'hidden' }}
            animate={{ rotateY: 0, backfaceVisibility: 'hidden' }}
            exit={{ rotateY: -180, backfaceVisibility: 'hidden' }}
            transition={{
              duration: 0.3,
              type: 'spring',
              stiffness: 500,
              damping: 60,
              mass: 1,
            }}
            key={character.node.id}
          >
            <div className='flex w-1/2 gap-2 bg-secondary'>
              {character.node.image && (
                <div
                  className="object-cover w-16 aspect-[2/3] bg-center bg-cover rounded-l-sm bg-secondary"
                  style={{backgroundImage: `url('${character.node.image.large}')`}}
                />
              )}
              <p className="flex flex-col justify-center overflow-hidden whitespace-nowrap">
                <span className="px-2 pt-4 text-sm text-ellipsis">{character?.node?.name?.full || ''}</span>
                <span className="px-2 pb-2 overflow-hidden text-xs text-white text-opacity-50 text-ellipsis">
                  {character?.node?.name?.native || '??'}
                </span>
              </p>
            </div>
            <div className='flex items-center justify-end w-1/2 gap-2 border-l border-dashed bg-secondary border-subtle/20'>
              <p className="flex flex-col overflow-hidden whitespace-nowrap">
                <span className="px-2 pt-4 text-sm text-ellipsis">{japaneseVA?.name?.full || '??'}</span>
                <span className="px-2 pb-2 overflow-hidden text-xs text-white text-opacity-50 text-ellipsis">
                  {japaneseVA?.name?.native || '??'}
                </span>
              </p>
              {japaneseVA?.image && (
                <div
                className="object-cover w-16 aspect-[2/3] bg-center bg-cover rounded-r-sm bg-secondary"
                  style={{backgroundImage: `url('${japaneseVA.image.large}')`}}
                />
              )}
            </div>
          </motion.div>
        {/* ) : (
          <motion.div
            className="[backface-visibility: hidden] absolute top-0 left-0 h-full w-full cursor-help overflow-hidden  rounded-md"
            initial={{ rotateY: 180, backfaceVisibility: 'hidden' }}
            animate={{ rotateY: 0, backfaceVisibility: 'hidden' }}
            exit={{ rotateY: -180, backfaceVisibility: 'hidden' }}
            transition={{ duration: 0.3 }}
          >
            {japaneseVA.image && <img src={japaneseVA.image.large} className="object-cover" />}
            <p className="absolute bottom-0 left-0 flex flex-col w-full overflow-hidden whitespace-nowrap bg-gradient-to-t from-secondary">
              <span className="px-2 pt-4 text-sm text-ellipsis">{japaneseVA.name.full}</span>
              <span className="px-2 pb-2 overflow-hidden text-xs text-white text-opacity-50 text-ellipsis">
                {japaneseVA.name.native}
              </span>
            </p>
          </motion.div>
        )} */}
      </AnimatePresence>
    </div>
  )
}

function AnimeCharacters({ characters }: Props) {
  const [expanded, setExpanded] = useState(false)
  const { t } = useTranslation()

  return (
    <div className="mt-8">
      <h3 className="mt-4 mb-2 font-bold">{t('anime.property.characters')}</h3>
      <div
        className={`w-full ${
          expanded ? 'h-full' : 'h-64'
        } relative mb-4 overflow-hidden transition-all duration-300`}
      >
        <div className="mt-1.5 mb-2 grid w-full grid-cols-2 2xl:grid-cols-3 gap-4">
          {characters.map((character, index) => {
            return <AnimeCharactersCard character={character} key={`character.${index}`} />
          })}
        </div>
        {!expanded ? (
          <div className="absolute bottom-0 w-full h-full px-2 pb-2 bg-gradient-to-t from-primary">
            <span
              className="absolute font-semibold cursor-pointer select-none bottom-2"
              onClick={() => {
                setExpanded(true)
              }}
            >
              {t('generic.cta.seeMore')}
            </span>
          </div>
        ) : (
          <span
            className="font-semibold cursor-pointer select-none"
            onClick={() => {
              setExpanded(false)
            }}
          >
            {t('generic.cta.seeLess')}
          </span>
        )}
      </div>
    </div>
  )
}

export default AnimeCharacters
