import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { AnilistStaff } from '../../services/anilist/anilistService'

type Props = {
  staff: AnilistStaff[]
}

function StaffCard({ person }: { person: AnilistStaff }) {
  return (
    <div className="relative aspect-[2/3] w-full">
      <div className="absolute top-0 left-0 h-full w-full overflow-hidden rounded-md">
        <img src={person.image.large} className="h-full w-full object-cover" />
        <p className="absolute bottom-0 left-0 flex w-full flex-col overflow-hidden whitespace-nowrap bg-gradient-to-t from-primary">
          <span className="text-ellipsis px-2 pt-4 text-sm">{person.name.full}</span>
          <span className="text-epersonllipsis overflow-hidden px-2 text-xs text-white text-opacity-60">
            {person.name.native}
          </span>
          <span className="overflow-hidden px-2 pb-2 text-xs text-gray-400">
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
      <h3 className="mb-2 font-bold">{t('anime_heading_staff')}</h3>
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
