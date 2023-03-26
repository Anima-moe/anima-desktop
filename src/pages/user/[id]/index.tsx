import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import ReactMarkdown from 'react-markdown'
import { useQuery } from 'react-query'

import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import { useRouter } from 'next/router'
import remarkEmoji from 'remark-emoji'
import remarkGfm from 'remark-gfm'

import UserComment from '@/components/Comments/UserComment'
import SwiperPlayerHead from '@/components/Episode/PlayerHeadSwiper'
import Loading from '@/components/General/Loading'
import ContentContainer from '@/components/Layout/ContentContainer'
import GeneralLayout from '@/components/Layout/General'
import UserProfileSection from '@/components/User/ProfileSection'
import UserBadge from '@/components/User/UserBadge'
import UserCard from '@/components/User/UserCard'
import usePresence from '@/hooks/usePresence'
import { User as UserService } from '@/services/anima/user'
import remarkEmbed from '@flowershow/remark-embed'


dayjs.extend(duration)


async function fetchUser(id: string | number) {
  if (!id) { return }

  if (id === 'me') {
    return await UserService.me()
  } else {
    return await UserService.get(Number(id))
  }
}

async function fetchPlayerHead(id: string | number) {
  if (id === 'me') {
    return await UserService.getMyPlayerHeads()
  } else {
    return await UserService.getPlayerHeads(Number(id))
  }
}

async function fetchLatestComments(id: string | number) {
  if (!id || !Number(id)) { return }

  return await UserService.getLatestComments(Number(id))
}

const User = () => {
  const router = useRouter()
  const { t } = useTranslation()
  const {clearPresence} = usePresence()

  const { data: userData, isLoading: userIsLoading, error: userError} = useQuery(`/api/user/${router.query.id}`, () => { return fetchUser(router.query.id as string) }, {
    refetchOnWindowFocus: false
  })
  const { data: userPlayerHead, isLoading: userPlayerHeadIsLoading, error: userPlayerHeadError} = useQuery(`/api/user/${router.query.id}/player-head`, () => { return fetchPlayerHead(router.query.id as string) }, {
    refetchOnWindowFocus: false,
  })
  const { data: userComments, isLoading: userCommentsIsLoading, error: userCommentsError} = useQuery(`/api/user/${router.query.id}/comments`, () => { return fetchLatestComments(router.query.id as string) }, {
    refetchOnWindowFocus: false,
  })

  useEffect(()=>{
    if (!userData) { return }
    clearPresence('/user/' + userData.id, `@${userData.username}`)
  }, [userData])

  if (userIsLoading || !router.isReady) return (
    <GeneralLayout>
      <div className="absolute items-center justify-center -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
        <Loading sm />
      </div>
    </GeneralLayout>
  )
  
  if (userError) return <GeneralLayout>
    <ContentContainer>
      <span className='absolute text-xs -translate-x-1/2 -translate-y-1/2 text-sublte top-1/2 left-1/2'>
        ERR: No profile or invalid profile
      </span>
    </ContentContainer>
  </GeneralLayout>

  return (
    <GeneralLayout fluid>
      <div className={'cover absolute top-0 left-0 h-screen w-screen overflow-hidden pointer-events-none z-[0]'} style={{backgroundImage: `url('${userData?.profile?.background}')`}}>
        {userData?.profile?.background ? (
          (userData?.profile?.background && userData?.profile?.background.endsWith('.mp4') || userData?.profile?.background.endsWith('.webm')) && (
            <video autoPlay loop muted className='z-0 object-cover w-screen h-screen' src={userData?.profile?.background || '/i/splash/mp4'} />
          )
        ) : (
          <video autoPlay loop muted className='z-0 object-cover w-screen h-screen' src='/i/splash.mp4' />
        )}
        <div className='absolute inset-0 w-screen h-screen from-primary bg-gradient-to-t to-primary/60' />
      </div>
      <div className='mt-28 z-[1]'>
        <UserCard showEditButton={router.asPath === '/user/me'} user={userData} showStatics showAddConnectionButton={router.asPath === '/user/me'}/>
      </div>
      <div className='flex flex-row gap-4 px-8 mt-8 z-[1] w-full max-w-[99%]'>
        <div className='flex flex-col w-1/5 h-6 gap-8'>
          <UserProfileSection title='Badges' overlayColor={userData.profile.color}>
            <div className='flex flex-wrap items-center justify-center w-screen gap-3 hnscreem'>
              {userData?.profile?.Badge?.map((badge, i) => {
                if (!badge.icon) return
                return <UserBadge badge={badge} key={`user.${badge.name}.${i}`} className='w-8 h-8' />
              })}
            </div>
          </UserProfileSection>
          <UserProfileSection title='Friends' overlayColor={userData.profile.color}/>
        </div>
        <div className='flex flex-col w-4/5 gap-8'>
          <UserProfileSection title='Bio' overlayColor={userData.profile.color}>
          <div className='flex flex-col w-full anima-markdown'>
              <div className='max-h-[900px] overflow-scroll'>
                <ReactMarkdown  
                  remarkPlugins={[remarkEmbed, remarkGfm, remarkEmoji]}
                  components={{

                  }}
                >
                  {userData.profile.bio}
                </ReactMarkdown>
              </div>
            </div>
          </UserProfileSection>
          <UserProfileSection title='History' overlayColor={userData.profile.color}>
            <div className='relative w-full'>
              {userPlayerHead?.count > 0 &&  <>
                <SwiperPlayerHead playerHeads={userPlayerHead.data} slidesPerView={4}/>
                {userPlayerHead.count < 1 && (
                  <div className='w-full text-xs'>
                    <span className=' text-subtle'>👀</span>
                  </div>
                )}
              </>}
            </div>
          </UserProfileSection>
          <UserProfileSection title='Favorites' overlayColor={userData.profile.color}/>
          {!userCommentsError && userComments?.count > 0 && (
            <UserProfileSection title='Last comments'overlayColor={userData.profile.color}>
              {userComments?.data?.map((comment, i) => {
                return <UserComment disabled episodeID={comment.episode_id} comment={comment} key={`user.${comment.id}.${i}`} />
              })}
            </UserProfileSection>
          )}
        </div>
      </div>
    </GeneralLayout>
  )
}

export default User
