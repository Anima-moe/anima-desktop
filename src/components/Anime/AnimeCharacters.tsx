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
      className="relative aspect-[2/3] w-full"
      onMouseEnter={() => {
        if (!japaneseVA) return

        setpersona('voiceActor')
      }}
      onMouseLeave={() => {
        setpersona('character')
      }}
    >
      <AnimatePresence initial={false}>
        {persona === 'character' ? (
          <motion.div
            className="absolute top-0 left-0 h-full w-full cursor-help overflow-hidden rounded-md"
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
            {character.node.image && (
              <img
                src={persona === 'character' ? character.node.image.large : japaneseVA.image.large}
                className="h-full w-full object-cover"
              />
            )}
            <p className="absolute bottom-0 left-0 flex w-full flex-col overflow-hidden whitespace-nowrap bg-gradient-to-t from-primary">
              <span className="text-ellipsis px-2 pt-4 text-sm">{character.node.name.full}</span>
              <span className="overflow-hidden text-ellipsis px-2 pb-2 text-xs text-white text-opacity-50">
                {' '}
                {character.node.name.native}{' '}
              </span>
            </p>
          </motion.div>
        ) : (
          <motion.div
            className="[backface-visibility: hidden] absolute top-0 left-0 h-full w-full cursor-help overflow-hidden  rounded-md"
            initial={{ rotateY: 180, backfaceVisibility: 'hidden' }}
            animate={{ rotateY: 0, backfaceVisibility: 'hidden' }}
            exit={{ rotateY: -180, backfaceVisibility: 'hidden' }}
            transition={{ duration: 0.3 }}
          >
            {japaneseVA.image && <img src={japaneseVA.image.large} className="object-cover" />}
            <p className="absolute bottom-0 left-0 flex w-full flex-col overflow-hidden whitespace-nowrap bg-gradient-to-t from-secondary">
              <span className="text-ellipsis px-2 pt-4 text-sm">{japaneseVA.name.full}</span>
              <span className="overflow-hidden text-ellipsis px-2 pb-2 text-xs text-white text-opacity-50">
                {japaneseVA.name.native}
              </span>
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function AnimeCharacters({ characters }: Props) {
  const [expanded, setExpanded] = useState(false)
  const { t } = useTranslation()

  return (
    <div className="mt-8">
      <h3 className="mt-4 mb-2 font-bold">{t('anime_heading_characters')}</h3>
      <div
        className={`w-full ${
          expanded ? 'h-full' : 'h-64'
        } relative mb-4 overflow-hidden transition-all duration-300`}
      >
        <div className="mt-1.5 mb-2 grid w-full grid-cols-8 gap-4">
          {characters.map((character, index) => {
            return <AnimeCharactersCard character={character} key={`character.${index}`} />
          })}
        </div>
        {!expanded ? (
          <div className="absolute bottom-0 h-full w-full bg-gradient-to-t from-primary px-2 pb-2">
            <span
              className="absolute bottom-2 cursor-pointer select-none font-semibold"
              onClick={() => {
                setExpanded(true)
              }}
            >
              {t('cta_seeMore')}
            </span>
          </div>
        ) : (
          <span
            className="cursor-pointer select-none font-semibold"
            onClick={() => {
              setExpanded(false)
            }}
          >
            {t('cta_seeLess')}
          </span>
        )}
      </div>
    </div>
  )
}

export default AnimeCharacters
