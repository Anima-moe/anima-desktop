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
      }

      const fetchPopulat = await Anime.getByCategory(26)
      if (fetchPopulat.count && fetchPopulat.count > 0 ) {
        setPopularAnimes(fetchPopulat.data)
      }

    })()
  }, [])

  useEffect(fetchAnimeData, [fetchAnimeData])

  return <GeneralLayout fluid>
    {/* <AnimeHero anime={{
      background: 'https://64.media.tumblr.com/47c4c55d145d06345b6ead8965805379/0c5a054892d75f30-e2/s540x810/8b4fe1ad19e63c9559f40cf82ff0979529368999.gifv',
      cover: 'https://www.crunchyroll.com/imgsrv/display/thumbnail/1560x2340/catalog/crunchyroll/d48d4a62b0ac6381c87bd040b69b0a89.jpe',
      external_id: '',
      AnimeMetadata: [],
      seasons: [],
      slug: 'teste'
    }} /> */}

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
