import { useCallback, useState, useEffect } from 'react';
import GeneralLayout from '@/components/Layout/General'
import AnimeHero from "@/components/Anime/AnimeHero"
import DonationReminder from "@/components/General/DonationReminder"
import ContentContainer from '@/components/Layout/ContentContainer'
import { Anime } from '@/services/anima/anime'
import { useTranslation } from 'react-i18next';
import AnimeScroll from '@/components/Anime/AnimeScroll';

function App() {
  const [simulcastAnimes, setSimulcastAnimes] = useState<Anima.RAW.Anime[]>([])
  const [popularAnimes, setPopularAnimes] = useState<Anima.RAW.Anime[]>([])
  const [popularAllTimeAnimes, setPopularAllTimeAnimes] = useState<Anima.RAW.Anime[]>([])
  const [heroAnime, setHeroAnime] = useState<Anima.RAW.Anime>({} as Anima.RAW.Anime)
  const { t } = useTranslation()
  const fetchAnimeData = useCallback(()=>{
    (async ()=>{
      const fetchSimulcast = await Anime.getByCategory(16)
      if (fetchSimulcast.count && fetchSimulcast.count > 0 ) { 
        setSimulcastAnimes(fetchSimulcast.data)
        setHeroAnime(fetchSimulcast.data[Math.floor(Math.random() * fetchSimulcast.count)])
      }

      const fetchPopulat = await Anime.getByCategory(26)
      if (fetchPopulat.count && fetchPopulat.count > 0 ) {
        setPopularAnimes(fetchPopulat.data)
      }
    })()
  }, [])

  useEffect(fetchAnimeData, [fetchAnimeData])

  return <GeneralLayout fluid>
    <AnimeHero anime={heroAnime} /> 

    <ContentContainer>
     <DonationReminder />
    </ContentContainer>

    <ContentContainer>
      <h3>Continue watching</h3>{/*  */}
      {/* TODO: LOAD RECENTLY WATCHED EPISODES/ANIMES */}
    </ContentContainer>
    <ContentContainer>
      <h3>{t('section_simulcast')}</h3>
      <AnimeScroll animes={simulcastAnimes} animesPerScreen={7}/>
    </ContentContainer>

    <ContentContainer>
      <h3>{t('section_popular')}</h3>
      <AnimeScroll animes={popularAnimes} animesPerScreen={7}/>
    </ContentContainer>
  </GeneralLayout>
}

export default App
