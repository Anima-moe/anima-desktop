import { useQuery } from 'react-query'

import { SignIn } from 'phosphor-react'
import { SkeletonText } from 'skeleton-elements/react'

import { Episode } from '@/services/anima/episode'
import { getLocaleMetadata } from '@/services/anima/getMetadataFromMedia'

import Button from '../General/Button'
import Loading from '../General/Loading'

interface IW2GRoomProps {
  room: Anima.TARDIS.Room
  onClick?: () => void
}

function fetchEpisode(episodeID?: string) {
  if (!episodeID) return
  return Episode.get(Number(episodeID))
}

const beautyNumber = (number: number) => {
  if (number < 10) return `00${number}`
  if (number < 100) return `0${number}`
  return number
}

const W2GRoom: React.FunctionComponent<IW2GRoomProps> = ({ room, onClick }) => {
  const { data: episodeData, isLoading: episodeLoading, error: episodeError, } = useQuery(`/api/episode/${room.episodeID}`, () => fetchEpisode(String(room.episodeID)))

  return <div 
    className='flex flex-col gap-2 rounded-md bg-secondary w-[calc(calc(100vw-4rem)/3-42px)] 2xl:w-[calc(calc(100vw-4rem)/4-42px)] group cursor-pointer hover:bg-tertiary duration-200'
    onClick={onClick}
  >
    { episodeData ? (
      <div 
        className='relative w-full bg-center bg-cover rounded-sm aspect-video' 
        style={{
          backgroundImage: `url('${episodeData.data?.thumbnail}')`
        }} 
      >
         <span 
          className='absolute flex gap-2 px-2 py-1 text-xs rounded-md text-white/40 bg-secondary w-min top-2 left-2'
         >
            #{beautyNumber(room.id)}
          </span>
      </div>
    ) : (
      <div className='w-full rounded-md aspect-video bg-tertiary'>
        <Loading />
      </div>
      )}
    <div className='flex flex-col gap-2 p-2'>
      <div className='flex items-center justify-between gap-3 overflow-hidden whitespace-nowrap'>
        <div className='w-12 h-12'>
          {room.participants?.length > 0 && (
              room.participants.map( (participant, index) => {
                if (participant?.id !== room.leader) { return null }
                
                return <div 
                  style={{
                    backgroundImage: `url('${participant?.payload?.profile?.avatar}')`,
                    marginLeft: index > 0 ? '-0.5rem' : '0'
                  }} 
                  className='w-12 h-12 bg-center bg-cover rounded-sm shadow-sm bg-tertiary'
                  key={`room.${room.id}.participant.${participant?.id}.${index}`}
                />
              })
            )}
        </div>
        <div className='w-full'>
          <h2 className='overflow-hidden font-bold text-ellipsis whitespace-nowrap'>{room.name}</h2>
          {episodeData ? <>
            <h3 className='w-full overflow-hidden text-xs text-ellipsis text-subtle'>E{episodeData.data.id} - {getLocaleMetadata<Anima.RAW.Episode, Anima.RAW.EpisodeMetadata>(episodeData.data)?.title || 'Unknown Episode'}</h3>
          </> : (
            <SkeletonText effect='wave' tag='h3'> Episode Name </SkeletonText>
          )}
        </div>
      </div>
    </div>
  </div>
}

export default W2GRoom
