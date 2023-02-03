import { useCallback, useState, useEffect } from 'react';
import GeneralLayout from '@/components/Layout/General'
import AnimeHero from "@/components/Anime/AnimeHero"
import DonationReminder from "@/components/General/DonationReminder"
import ContentContainer from '@/components/Layout/ContentContainer'
import { Anime } from '@/services/anima/anime'
import { useTranslation } from 'react-i18next'
import AnimeScroll from '@/components/Anime/AnimeScroll'
import AnimeSwiper from '@/components/Anime/AnimeSwiper'
import useSWR from 'swr'

const fetchPopularAnimes = () =>{ 
  return Anime.getByCategory(26) 
}
const fetchSimulcastAnimes = () =>{ 
  return Anime.getByCategory(16) 
}

function App() {
  const { data: simulcastAnimes, error: simulcastError, isLoading: loadingSimulcast } = useSWR<Anima.API.GetAnimes>(`/api/getSimulcast`, fetchSimulcastAnimes)
  const { data: popularAnimes, error: popularError, isLoading: loadingPopular } = useSWR<Anima.API.GetAnimes>(`/api/getPopular`, fetchPopularAnimes)
  const [heroAnime, setHeroAnime] = useState<Anima.RAW.Anime>({} as Anima.RAW.Anime)
  const { t } = useTranslation()

  const decideHeroAnime = useCallback(()=>{
    if (simulcastAnimes) setHeroAnime(simulcastAnimes.data[Math.floor(Math.random() * simulcastAnimes.data.length)])
    else if (popularAnimes) setHeroAnime(popularAnimes.data[Math.floor(Math.random() * popularAnimes.data.length)])
    else return
  }, [simulcastAnimes])

  useEffect(decideHeroAnime, [decideHeroAnime])

  if (simulcastError || popularError) return <GeneralLayout fluid><div className='flex justify-center items-center h-screen'><h1 className='text-2xl'>Error</h1></div></GeneralLayout>


  return <GeneralLayout fluid>
    
    <AnimeHero anime={heroAnime} /> 

    {/* <ContentContainer>
     <DonationReminder />
    </ContentContainer> */}

    {/* <ContentContainer> */}
      {/* <h3>Continue watching</h3> */}
      {/* TODO: LOAD RECENTLY WATCHED EPISODES/ANIMES */}
    {/* </ContentContainer> */}

    <ContentContainer>
      <h3>{t('section_simulcast')}</h3>
      <AnimeSwiper loading={loadingSimulcast} animes={simulcastAnimes?.data} animesPerScreen={7}/>
    </ContentContainer>

    <ContentContainer>
      <h3>{t('section_popular')}</h3>
      <AnimeSwiper loading={loadingSimulcast} animes={popularAnimes?.data} animesPerScreen={7}/>
    </ContentContainer>
  </GeneralLayout>
}

export default App
