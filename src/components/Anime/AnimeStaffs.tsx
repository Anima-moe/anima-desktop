import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { AnilistStaff } from '../../services/anilist/anilistService'

type Props = {
  staff: AnilistStaff[]
}

function StaffCard({ person }: { person: AnilistStaff }) {
  return (
    <div className="relative aspect-[2/3] w-full">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden rounded-md">
        <img src={person.image.large} className="object-cover w-full h-full" />
        <p className="absolute bottom-0 left-0 flex flex-col w-full overflow-hidden whitespace-nowrap bg-gradient-to-t from-primary">
          <span className="px-2 pt-4 text-sm text-ellipsis">{person.name.full}</span>
          <span className="px-2 overflow-hidden text-xs text-white text-epersonllipsis text-opacity-60">
            {person.name.native}
          </span>
          <span className="px-2 pb-2 overflow-hidden text-xs text-gray-400">
            {' '}
            {person.primaryOccupations}{' '}
          </span>
        </p>
      </div>
    </div>
  )
}

function AnimeCharacters({ staff }: Props) {
  const [expanded, setExpanded] = useState(false)

  const { t } = useTranslation()

  return (
    <div className="mt-12">
      <h3 className="mb-2 font-bold">{t('anime.property.staff')}</h3>
      <div
        className={`w-full ${
          expanded ? 'h-full' : 'h-64'
        } relative mb-4 overflow-hidden transition-all duration-300`}
      >
        <div className="mt-1.5 mb-2 grid w-full grid-cols-8 gap-4">
          {staff.map((person, index) => {
            return <StaffCard person={person} key={`character.${index}`} />
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
