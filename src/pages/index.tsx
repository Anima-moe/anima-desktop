import { useCallback, useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'

import AnimeHero from '@/components/Anime/AnimeHero'
import AnimeSwiper from '@/components/Anime/AnimeSwiper'
import EpisodePlayerHead from '@/components/Episode/EpisodePlayerHead'
import SwiperPlayerHead from '@/components/Episode/PlayerHeadSwiper'
import DonationReminder from '@/components/General/DonationReminder'
import ContentContainer from '@/components/Layout/ContentContainer'
import GeneralLayout from '@/components/Layout/General'
import usePresence from '@/hooks/usePresence'
import { Anime } from '@/services/anima/anime'
import { User as UserService } from '@/services/anima/user'

const fetchPopularAnimes = () => {
  return Anime.getByCategory(30)
}
const fetchSimulcastAnimes = () => {
  return Anime.getByCategory(33)
}
const fetchStaffPickAnimes = () => {
  return Anime.getByCategory(34)
}

function App() {
  const {
    data: simulcastAnimes,
    error: simulcastError,
    isLoading: loadingSimulcast,
  } = useQuery<Anima.API.GetAnimes>('/api/getSimulcast', fetchSimulcastAnimes, {
    retry: 3,
    staleTime: Infinity,
    cacheTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
  })
  const {
    data: popularAnimes,
    error: popularError,
    isLoading: loadingPopular,
  } = useQuery<Anima.API.GetAnimes>('/api/getPopular', fetchPopularAnimes, {
    retry: 3,
    staleTime: Infinity,
    cacheTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
  })
  const {
    data: userPlayerHead,
    isLoading: userPlayerHeadIsLoading,
    error: userPlayerHeadError,
  } = useQuery(
    '/api/user/me/player-head',
    () => {
      return UserService.getMyPlayerHeads()
    },
    {
      refetchOnWindowFocus: false,
    }
  )
  const {
    data: staffAnimes,
    error: staffError,
    isLoading: loadingStaffPick,
  } = useQuery<Anima.API.GetAnimes>('/api/getStaff', fetchStaffPickAnimes, {
    retry: 3,
    staleTime: Infinity,
    cacheTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
  })
  const [heroAnime, setHeroAnime] = useState<Anima.RAW.Anime>({} as Anima.RAW.Anime)
  const { t } = useTranslation()
  const { clearPresence } = usePresence()

  const decideHeroAnime = useCallback(() => {
    clearPresence('Home')
    if (simulcastAnimes)
      setHeroAnime(simulcastAnimes.data[Math.floor(Math.random() * simulcastAnimes.data.length)])
    else if (popularAnimes)
      setHeroAnime(popularAnimes.data[Math.floor(Math.random() * popularAnimes.data.length)])
    else return
  }, [simulcastAnimes])

  useEffect(decideHeroAnime, [decideHeroAnime])

  if (simulcastError || popularError)
    return (
      <GeneralLayout fluid>
        <div className="flex h-screen items-center justify-center">
          <h1 className="text-2xl">Error</h1>
        </div>
      </GeneralLayout>
    )

  return (
    <GeneralLayout fluid>
      <AnimeHero anime={heroAnime} />
      {userPlayerHead && userPlayerHead.data.length > 0 && (
        <ContentContainer>
          <h3>{t('section_continueWatching')}</h3>
          <SwiperPlayerHead playerHeads={userPlayerHead.data} />
          {/* {userPlayerHead.data.map(ph => {
            return <EpisodePlayerHead key={`episode.playerhead.${ph.user_id}.${ph.episode_id}`} playerHead={ph} />
          })} */}
        </ContentContainer> 
      )}

      <ContentContainer>
        <h3>{t('section_simulcast')}</h3>
        <AnimeSwiper
          loading={loadingSimulcast}
          animes={simulcastAnimes?.data}
          animesPerScreen={6}
        />
      </ContentContainer>

      <ContentContainer>
        <h3>{t('section_popular')}</h3>
        <AnimeSwiper loading={loadingSimulcast} animes={popularAnimes?.data} animesPerScreen={6} />
      </ContentContainer>

      <ContentContainer>
        <h3>{t('section_staffPick')}</h3>
        <AnimeSwiper loading={loadingStaffPick} animes={staffAnimes?.data} animesPerScreen={6} />
      </ContentContainer>
    </GeneralLayout>
  )
}

export default App
