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
        className='bg-secondary shadow-lg rounded-md w-[450px] h-[200px] border border-tertiary overflow-hidden flex gap-1.5 flex-col p-1' 
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
        className='bg-secondary shadow-lg rounded-md w-[450px] h-[200px] border border-tertiary overflow-hidden flex gap-1.5 flex-col p-1' 
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
        <div className='w-full h-full inset-0 rounded-md z-[4] bg-secondary bg-cover bg-center' style={{backgroundImage: `url(${data?.profile?.banner || '/i/banner.png'})`}} />
        {/* SHADE CONTAINER */}
        <div className='bottom-0 left-0 w-full py-6 overflow-hidden rounded-md bg-secondary/90 backdrop-blur-sm'>
          {/* ACCENT */}
          <div className='absolute inset-0 w-full h-full opacity-20' style={{ backgroundColor: data.profile?.color }} />
          {/* USER INFORMATION */}
          <div className='flex items-center w-full h-full gap-2 px-2'>
            <div
              className='h-16 w-16 rounded-md bg-cover bg-center bg-no-repeat z-[1] bg-primary'
              style={{
                backgroundImage: `url('${
                  data?.profile?.avatar ?? 'https://i.imgur.com/CBdQGA3.png'
                }')`,
              }}
            />
            <div className='flex flex-col gap-2'>
              <div className='z-[1] flex items-center'>
                <span
                  className="ml-1 text-xl font-semibold"
                  style={{ color: `${data?.profile?.color || '#FFFFFF'}` }}
                >
                    {data?.username}
                </span>
                <div className='ml-1.5'>
                  {data?.profile?.Badge?.map((badge, i) => {
                    if (badge.icon) return
                    return <UserBadge badge={badge} key={`user.${badge.name}.${i}`} />
                  })}
                </div>
              </div>
              
              <div className='flex gap-2'>
                  {data?.profile?.Badge?.map((badge, i) => {
                    if (!badge.icon) return
                    return <UserBadge badge={badge} key={`user.${badge.name}.${i}`} className='!w-5 !h-5' />
                  })}
              </div>
            </div>
          </div>
        </div>
        <Tooltip.Arrow className='fill-secondary stroke-tertiary' />
      </Tooltip.Content>
    </Tooltip.Portal>

}

export default FloatingProfile
