import { useQuery } from 'react-query'

import GeneralLayout from '@/components/Layout/General'
import UserCard from '@/components/User/UserCard'
import {User as UserService} from '@/services/anima/user'


const User = () => {
  const { data: userData, isLoading: userIsLoading, error: userError} = useQuery('/api/user/me', () => UserService.me(), {
    refetchOnWindowFocus: false
  })
  const background = '/i/splash.mp4' // example

  if (userIsLoading) return <div>Loading...</div>
  if (userError) return <div>Error</div>

  return (
    <GeneralLayout fluid>
      <div className={'cover absolute top-0 left-0 z-[-1] h-full w-full overflow-hidden'}>
        {background ? (
          (background.endsWith('.mp4') || background.endsWith('.webm')) && (
            <video autoPlay loop muted className='h-full w-full object-cover' src={background} />
          )
        ) : (
          <video autoPlay loop muted className='h-full w-full object-cover' src={userData?.profile?.background || '/i/splash.mp4'} />
        )}
      </div>
      <div className='absolute top-0 left-0 h-full w-full bg-primary/70 bg-gradient-to-t from-primary to-transparent' />
      <div className='z-10 mx-8 my-24'>
        <UserCard user={userData} showStatics />
        <div className='flex w-full flex-col gap-y-4 rounded-md bg-secondary p-5'>
          {Array.from({ length: 2 }).map((item, i) => (
            <div key={i} className='flex flex-col gap-y-2 overflow-hidden'>
              <span className='text-xl text-subtle'>Hist</span>
              <div className='flex gap-x-4'>
                {Array.from({ length: 7 }).map((item, i) => (
                  <img
                    key={i}
                    src='/test/hist.png'
                    alt=''
                    className='bg-cover bg-center bg-no-repeat'
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </GeneralLayout>
  )
}

export default User
