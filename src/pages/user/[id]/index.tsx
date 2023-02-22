import { useQuery } from 'react-query'

import { useRouter } from 'next/router'

import GeneralLayout from '@/components/Layout/General'
import UserCard from '@/components/User/UserCard'
import {User as UserService} from '@/services/anima/user'

async function fetchUser(id: string | number) {
  if (!id) { return }

  if (id === 'me') {
    return await UserService.me()
  } else {
    return await UserService.get(Number(id))
  }
}

const User = () => {
  const router = useRouter()
  
  const { data: userData, isLoading: userIsLoading, error: userError} = useQuery(`/api/user/${router.query.id}`, () => { return fetchUser(router.query.id as string) }, {
    refetchOnWindowFocus: false
  })

  if (userIsLoading || !router.isReady) return <div>Loading...</div>
  if (userError) return <div>Error</div>

  return (
    <GeneralLayout fluid layoutId='userprofile'>
      <div className={'cover absolute top-0 left-0 z-[-1] h-full w-full overflow-hidden'} style={{backgroundImage: `url('${userData?.profile?.background}')`}}>
        {userData?.profile?.background ? (
          (userData?.profile?.background && userData?.profile?.background.endsWith('.mp4') || userData?.profile?.background.endsWith('.webm')) && (
            <video autoPlay loop muted className='h-full w-full object-cover' src={userData?.profile?.background || '/i/splash/mp4'} />
          )
        ) : (
          <video autoPlay loop muted className='h-full w-full object-cover' src={userData?.profile?.background} />
        )}
      </div>
      <div className='fixed top-0 left-0 h-screen w-screen bg-primary/70 bg-gradient-to-t from-primary to-transparent' />
      <div className='z-10 mx-8 my-24'>
        <UserCard user={userData} showStatics showEditButton={router.query.id && (router.query.id as string) === 'me'}/>
        <div className='flex w-full flex-col gap-y-8 rounded-md bg-secondary p-5'>
          <div className='flex flex-col gap-y-4 overflow-hidden text-center'>
            <p dangerouslySetInnerHTML={{__html: userData?.profile?.bio?.replace('\\n', '<br/>') || '🥰 anima.moe'}} />
          </div>
          <div className='flex flex-col gap-y-2 overflow-hidden'>
            <span className='text-xl text-subtle'>History</span>
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
        </div>
      </div>
    </GeneralLayout>
  )
}

export default User
