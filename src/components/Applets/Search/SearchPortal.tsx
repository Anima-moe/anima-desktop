import usePreventBodyScroll from '@/hooks/usePreventBodyScroll'
import useSWR from 'swr'
import AnimeScroll from '@/components/Anime/AnimeScroll'

async function fetcher(url: string) {
 // Fetch search info
 return {
  count: 1,
  data: Array(20)
  .fill(0)
  .map((_, ind) => (    {
    cover: 'https://www.crunchyroll.com/imgsrv/display/thumbnail/1560x2340/catalog/crunchyroll/7e023c55c6cb63b2ecbb31b6aae9bf12.jpe',
    background: '',
    slug: '',
    external_id: '',
    metadata: {
      'pt-BR': {
        id: 0,
        title: 'My Hero Academia',
        synopsis: '',
        type: 'anime',
        locale_key: 'pt-BR',
        anime_id: 0,
      }
    },
    seasons: [
      {
        id: 0,
        title: '',
        number: 0,
        anime_id: 0,
      }
    ]
  }))


 } as Anima.API.SearchAnime
}

type Props = {
  query?: string
}

function SearchPortal({query = ''}: Props) {
  const { disableScroll, enableScroll } = usePreventBodyScroll();
  const {data, error, isLoading} = useSWR<Anima.API.SearchAnime>(`/api/search/${query}`, ()=>{return fetcher(query)})

  if (!query || query.length < 3) { return (
    <div className='fixed left-0 top-0 w-full h-screen bg-primary bg-opacity-90 z-[1] flex px-32 py-52 items-center justify-center'>
      <span className='text-xs text-subtle'>The search query must contain at least 3 characters</span>
    </div>
  )}


  if (error) { return(
    <div className='fixed left-0 top-0 w-full h-screen bg-primary bg-opacity-90 z-[1] flex px-32 py-52'>
      <span></span>
    </div>
  )}

  if (isLoading) { return (
    <div className='fixed left-0 top-0 w-full h-screen bg-primary bg-opacity-90 z-[1] flex px-32 py-52'>
      loading
    </div>
  )}

  return <div className='fixed left-0 top-0 w-full h-screen bg-primary bg-opacity-95 z-[1] flex px-32 py-52'>
      <div className='flex w-full relative h-min' onMouseEnter={()=>{
        console.log("Disabling scroll")
        disableScroll()
      }} onMouseLeave={()=>{
        console.log("Enabling scroll")
        enableScroll()
      }}>
        <AnimeScroll animes={data.data} animesPerScreen={7} alwaysShowInfo/>
      </div>
  </div>
}

export default SearchPortal