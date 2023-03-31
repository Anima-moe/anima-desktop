import { useCallback, useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'

import i18next from 'i18next'
import { CalendarX, ChartLineUp, Crown, Play, TelevisionSimple } from 'phosphor-react'
import { useWindowSize } from 'usehooks-ts'

import AnimeHero from '@/components/Anime/AnimeHero'
import AnimeSwiper from '@/components/Anime/AnimeSwiper'
import SwiperEpisode from '@/components/Episode/EpisodeSwiper'
import SwiperPlayerHead from '@/components/Episode/PlayerHeadSwiper'
import DonationReminder from '@/components/General/DonationReminder'
import SectionTitle from '@/components/General/SectionTitle'
import ContentContainer from '@/components/Layout/ContentContainer'
import GeneralLayout from '@/components/Layout/General'
import usePresence from '@/hooks/usePresence'
import useSession from '@/hooks/useSession'
import { Anime } from '@/services/anima/anime'
import { Episode as EpisodeService } from '@/services/anima/episode'
import { User as UserService } from '@/services/anima/user'

const fetchLatestAnimes = () => {
  return Anime.getLatest()
}
const fetchSimulcastAnimes = () => {
  return Anime.getByCategory(33)
}
const fetchPopularAnimes = () => {
  return Anime.getByCategory(30)
}
const fetchStaffPickAnimes = () => {
  return Anime.getByCategory(34)
}
const calculateItemsPerRow = (width: number) => {
  if (width < 1601) return 5
  // if (width < 1600) return 6
  if (width < 1921) return 6
  if (width < 2561) return 8
  if (width < 3841) return 10
  return 6
}
const fetchPlayerHeads = () => {
  return UserService.getMyPlayerHeads()
}
const fetchLatestEpisodes = () => {
  return EpisodeService.getLatest()
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
    data: latestAnimes,
    error: latestError,
    isLoading: loadingLatest,
  } = useQuery<Anima.API.GetAnimes>('/api/getLatest', fetchLatestAnimes, {
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
  } = useQuery<Anima.API.GetUserPlayerHead>('/api/user/me/player-head', fetchPlayerHeads, {
      refetchOnWindowFocus: false,
  })
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
  const { data: latestEpisodes, isLoading: loadingLatestEpisodes, error: latestEpisodesError } = useQuery<Anima.API.GetSeasonEpisodes>('/api/episode/latest', fetchLatestEpisodes)

  const [heroAnime, setHeroAnime] = useState<Anima.RAW.Anime>({} as Anima.RAW.Anime)
  const { t } = useTranslation()
  const { clearPresence } = usePresence()
  const { session, loading: loadingSession } = useSession()
  const { width, height } = useWindowSize()

  const decideHeroAnime = useCallback(() => {
    clearPresence('/', 'Home')
    if (simulcastAnimes) setHeroAnime(simulcastAnimes.data[Math.floor(Math.random() * simulcastAnimes.data.length)])
    else if (popularAnimes) setHeroAnime(popularAnimes.data[Math.floor(Math.random() * popularAnimes.data.length)])
    else return
  }, [simulcastAnimes])

  useEffect(decideHeroAnime, [decideHeroAnime])

  if (simulcastError || popularError)
    return (
      <GeneralLayout fluid>
        <div className="flex items-center justify-center h-screen">
          <h1 className="text-2xl">Error</h1>
        </div>
      </GeneralLayout>
    )

  return (
    <GeneralLayout fluid>
      <AnimeHero anime={heroAnime} />
      {userPlayerHead && (userPlayerHead.data.map(ph => ((ph.duration - ph.head) > 180) ? ph.head : 0).reduce((a,b) => a + b) > 1) && (
        <ContentContainer className="z-[1]">
          <SectionTitle Icon={Play} name={t('anime.section.continueWatching')} className="mb-2" />
          <SwiperPlayerHead playerHeads={userPlayerHead.data} hideCompleted={true} slidesPerView={calculateItemsPerRow(width)} />
        </ContentContainer>
      )}
      {latestEpisodes && latestEpisodes.data && (
        <ContentContainer>
          <SectionTitle Icon={CalendarX} name={t('anime.section.latestEpisodes')} className="mb-2" />
          <SwiperEpisode episodes={latestEpisodes.data} slidesPerView={calculateItemsPerRow(width)} />
        </ContentContainer>
      )}
      {(!loadingSession && session && session.premium < 1) ||
        (!loadingSession && !session && (
          <ContentContainer>
            <DonationReminder />
          </ContentContainer>
        ))}

      <ContentContainer>
        <SectionTitle Icon={TelevisionSimple} name={t('anime.section.simulcast')} className="mb-2" />
        <AnimeSwiper loading={loadingSimulcast} animes={simulcastAnimes?.data} animesPerScreen={calculateItemsPerRow(width)} />
      </ContentContainer>

      <ContentContainer>
        <SectionTitle Icon={CalendarX} name={t('anime.section.latest')} className="mb-2" />
        <AnimeSwiper loading={loadingLatest} animes={latestAnimes?.data} animesPerScreen={calculateItemsPerRow(width)} />
      </ContentContainer>

      <ContentContainer>
        <SectionTitle Icon={ChartLineUp} name={t('anime.section.popular')} className="mb-2" />
        <AnimeSwiper loading={loadingSimulcast} animes={popularAnimes?.data} animesPerScreen={calculateItemsPerRow(width)} />
      </ContentContainer>

      <ContentContainer>
        <SectionTitle Icon={Crown} name={t('anime.section.staffPick')} className="mb-2" />
        <AnimeSwiper loading={loadingStaffPick} animes={staffAnimes?.data} animesPerScreen={calculateItemsPerRow(width)} />
      </ContentContainer>
    </GeneralLayout>
  )
}

export default App
