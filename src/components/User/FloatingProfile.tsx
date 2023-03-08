import { useQuery } from 'react-query'

import { User } from '@/services/anima/user'
import * as Tooltip from '@radix-ui/react-tooltip'

import Loading from '../General/Loading'
import UserBadge from './UserBadge'

interface IFloatingProfileProps {
  user: Partial<Anima.RAW.User>
}

const FloatingProfile: React.FunctionComponent<IFloatingProfileProps> = ({user}) => {
  const { data, isLoading, error } = useQuery(`user/${user.id}/profile`, () => User.get(user.id), {
    cacheTime: 1000 * 60,
    staleTime: 1000 * 60,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  })

  if (isLoading) return <div className='w-full h-full flex'>
    <Tooltip.Portal >
      <Tooltip.Content 
        className='bg-secondary shadow-lg rounded-md w-[450px] h-[200px] border border-tertiary overflow-hidden flex gap-1.5 flex-col p-1' 
        collisionPadding={10}
        sideOffset={5}
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
      >
        {/* BACKGROUND */}
        <div 
          className='bg-cover bg-center w-full h-full inset-0 absolute rounded-md overflow-hidden'
          style={{ backgroundImage: `url('${data?.profile?.background})` }} 
        >
          {data?.profile?.background ? (
            (data?.profile?.background && data?.profile?.background.endsWith('.mp4') || data?.profile?.background.endsWith('.webm')) && (
              <video autoPlay loop muted className='h-full w-full object-cover' src={data?.profile?.background || '/i/splash/mp4'} />
            )
          ) : (
            // <></>
            <video autoPlay loop muted className='h-full w-full object-cover' src='/i/splash.mp4' />
            // <div className='w-full h-full inset-0 absolute rounded-md' style={{backgroundImage: `url('${data.profile.banner})`}} />
          )}
        </div>
        <div className='w-full h-full inset-0 rounded-md z-[4] bg-secondary bg-cover bg-center' style={{backgroundImage: `url(${data?.profile?.banner || '/i/banner.png'})`}} />
        {/* SHADE CONTAINER */}
        <div className='bg-secondary/90 left-0 bottom-0 w-full py-6 overflow-hidden rounded-md backdrop-blur-sm'>
          {/* ACCENT */}
          <div className='inset-0 w-full h-full absolute opacity-20' style={{ backgroundColor: data.profile?.color }} />
          {/* USER INFORMATION */}
          <div className='w-full h-full flex items-center gap-2 px-2'>
            <div
              className='h-16 w-16 rounded-full bg-cover bg-center bg-no-repeat z-[1]'
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
