import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { AnilistStaff } from '../../services/anilist/anilistService'


type Props = {
  staff: AnilistStaff[]
}

function StaffCard({person}: {person: AnilistStaff}) {
  return <div className='aspect-[2/3] w-full relative'>
        <div 
          className='w-full h-full absolute top-0 left-0 rounded-md overflow-hidden' 
        >
          <img src={person.image.large} className='w-full h-full object-cover' />
          <p className='absolute bottom-0 left-0 flex flex-col w-full overflow-hidden whitespace-nowrap bg-gradient-to-t from-primary'>
            <span className='text-sm text-ellipsis px-2 pt-4' >{person.name.full }</span>
            <span className='text-xs text-epersonllipsis text-white text-opacity-60 overflow-hidden px-2' >{person.name.native}</span>
            <span className='text-xs overflow-hidden px-2 pb-2 text-gray-400'> {person.primaryOccupations} </span>
          </p>
        </div>
  </div>
}

function AnimeCharacters({staff}: Props) {
  const [expanded, setExpanded] = useState(false)

  const { t } = useTranslation()

  return <div className='mt-12'>
    <h3 className='mb-2 font-bold'>{t('anime_heading_staff')}</h3>
    <div className={`w-full ${expanded ? 'h-full' : 'h-64' } overflow-hidden relative transition-all duration-300 mb-4`}>
      <div className='grid grid-cols-8 mt-1.5 w-full gap-4 mb-2'>
          {staff.map((person, index) => {
            return  <StaffCard person={person} key={`character.${index}`}/>
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