import { useQuery } from 'react-query'

import { User } from '@/services/anima/user'
import * as Tooltip from '@radix-ui/react-tooltip'

import Loading from '../General/Loading'
import UserBadge from './UserBadge'

interface IFloatingProfileProps {
  user: Partial<Anima.RAW.User>
  side?: 'top' | 'left' | 'right' | 'bottom'
}

const FloatingProfile: React.FunctionComponent<IFloatingProfileProps> = ({user, side}) => {
  const { data, isLoading, error } = useQuery(`user/${user.id}/profile`, () => User.get(user.id), {
    cacheTime: 1000 * 60,
    staleTime: 1000 * 60,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  })

  if (isLoading) return <div className='flex w-full h-full'>
    <Tooltip.Portal >
      <Tooltip.Content 
        className='bg-secondary shadow-lg rounded-md w-[400px] border border-tertiary overflow-hidden flex gap-1.5 flex-col p-1' 
        collisionPadding={10}
        sideOffset={5}
        side={side || 'top'}
      >
        <Loading />
      </Tooltip.Content>
    </Tooltip.Portal>
  </div>

  if (error) return null

  return  <Tooltip.Portal >
      <Tooltip.Content 
        className='bg-secondary shadow-lg rounded-md w-[400px] border border-tertiary overflow-hidden flex flex-col p-2' 
        collisionPadding={10}
        sideOffset={5}
        side={side || 'top'}
      >
        {/* BACKGROUND */}
        <div 
          className='absolute inset-0 w-full h-full overflow-hidden bg-center bg-cover rounded-md bg-secondary'
          style={{ backgroundImage: `url('${data?.profile?.background})` }} 
        >
          {data?.profile?.background ? (
            (data?.profile?.background && data?.profile?.background.endsWith('.mp4') || data?.profile?.background.endsWith('.webm')) && (
              <video autoPlay loop muted className='object-cover w-full h-full' src={data?.profile?.background || '/i/splash/mp4'} />
            )
          ) : (
            // <></>
            <video autoPlay loop muted className='object-cover w-full h-full' src='/i/splash.mp4' />
            // <div className='absolute inset-0 w-full h-full rounded-md' style={{backgroundImage: `url('${data.profile.banner})`}} />
          )}
        </div>
        {/* COVER & AVATAR*/}
        <div 
          className='w-full h-[170px] inset-0 rounded-t-md z-[4] bg-secondary bg-cover bg-center relative' 
          style={{backgroundImage: `url(${data?.profile?.banner || '/i/banner.png'})`}} 
        >
          <div
            className='h-[80%] aspect-square rounded-md bg-cover bg-center bg-no-repeat z-[1] bg-primary absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 relative'
            style={{
              backgroundImage: `url('${
                data?.profile?.avatar ?? 'https://i.imgur.com/CBdQGA3.png'
              }')`,
            }}
            >
              {data?.profile?.Badge?.map((badge, i) => {
                if (badge.icon) return
                return (
                  <UserBadge className="!absolute !bottom-0 !left-1/2 translate-y-1/2 !-translate-x-1/2 z-[2] pointer-events-none" badge={badge} key={`user.${badge.name}.${i}`} />
                )
              })}
          </div>
        </div>

        {/* SHADE CONTAINER */}
        <div className='relative bottom-0 left-0 w-full py-4 overflow-hidden rounded-b-md bg-secondary'>
          {/* ACCENT */}
          <div className='absolute inset-0 w-full h-full opacity-5' style={{ backgroundColor: data.profile?.color }} />
          {/* USER INFORMATION */}
            <div className='flex flex-col items-center justify-center w-full gap-4'>
              <div className='z-[1] flex items-center'>
                <span
                  className="text-3xl font-semibold"
                  style={{ color: `${data?.profile?.color || '#FFFFFF'}` }}
                >
                    {data?.username}
                </span>
              </div>
              
              <div className='flex gap-2'>
                  {data?.profile?.Badge?.map((badge, i) => {
                    if (!badge.icon) return
                    return <UserBadge badge={badge} key={`user.${badge.name}.${i}`} className='!w-8 !h-8' />
                  })}
              </div>
          </div>
        </div>
        <Tooltip.Arrow className='fill-secondary stroke-tertiary' />
      </Tooltip.Content>
    </Tooltip.Portal>

}

export default FloatingProfile
