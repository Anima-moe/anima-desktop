import { useEffect, useState } from 'react'
import { useQuery } from 'react-query'

import i18next from 'i18next'
import { ArrowLeft, ArrowRight, ArrowUp, MagnifyingGlass } from 'phosphor-react'

import AnimeGrid from '@/components/Anime/AnimeGrid'
import CategoryPill from '@/components/Category/CategoryPill'
import Button from '@/components/General/Button'
import IconInput from '@/components/General/Inputs/IconTextInput'
import Loading from '@/components/General/Loading'
import General from '@/components/Layout/General'
import useNavScroll from '@/hooks/useNavScroll'
import { Anime } from '@/services/anima/anime'
import { Category } from '@/services/anima/category'


const SearchPage: React.FunctionComponent = () => {
  const [contentType, setContentType] = useState('anime')
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [listedAnimes, setListedAnimes] = useState<Anima.RAW.Anime[]>([])
  const [query, setQuery] = useState('')
  const [categoryPage, setPage] = useState(0)
  const scrolled = useNavScroll()
  

  const { data: animeCategories, error: animeCategoriesError, isLoading: animeCategoriesLoading } = useQuery('animeCategories', fetchAnimeCategories, {
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  })

  const { data: animeSearchResult, isLoading: animeSearchLoading, error: animeSearchError, refetch: refetchAnimeSearch } = useQuery(`anime/search/${query}`, () => searchAnimes(query), { refetchOnWindowFocus: false  })
  const { data: animeCategoryResult, isLoading: animeCategoryLoading, error: animeCategoryError, refetch: refetchCategoryResult} = useQuery(`anime/category/${selectedCategories.join(',')}@${categoryPage}`, () => searchAnimeByCategory(selectedCategories, categoryPage) , { refetchOnWindowFocus: false  })
  
  async function fetchAnimeCategories() {
    return Category.getAll(i18next.language, 20)
  }

  async function searchAnimes(query: string) {
    if (!query || query.length < 3) return

    return await Anime.search(query)
  }

  async function searchAnimeByCategory(categories: string[], page?: number) {
    if (!categories || categories.length === 0) return
    
    const animesFromCategory = await Category.getMatchingAnimes(i18next.language, page || 0, categories)

    setListedAnimes([...listedAnimes, ...animesFromCategory.data || []])
    return  animesFromCategory
  }


  function filterAnimesByCategory(): Anima.RAW.Anime[] {
    if (!animeSearchResult?.data && !listedAnimes ) return []

    if (animeSearchResult && animeSearchResult.data.length > 0 && selectedCategories.length === 0) {
      return animeSearchResult.data
    }

    if (animeSearchResult && animeSearchResult.data.length > 0 && selectedCategories.length > 0) {
      const filteredAnimes = animeSearchResult.data.filter(anime =>{
        for (let i = 0; i < selectedCategories.length; i++) {
          if (!anime.Category.some(animeCategory => animeCategory.slug === selectedCategories[i])) {
            return false
          }
        }
        return true
      })

      return filteredAnimes
    }

    if (animeSearchResult && animeSearchResult.data.length > 0) {
      return animeSearchResult.data
    }
    
    if (listedAnimes && listedAnimes.length > 0) {
      return listedAnimes
    }

    return []
  }
  
  return <General>
    <div className='flex flex-col w-full gap-4 mt-20'>
      <IconInput 
          Icon={MagnifyingGlass}
          placeholder={`Search for ${contentType}`}
          onChange={(e) => setQuery(e.target.value) }
        />
      <div className='flex flex-row w-full'>
        <div className={'flex flex-col w-1/4 gap-4'}>
          <div className='flex flex-col w-full gap-2 p-4 rounded-md bg-secondary'>
            <h4>Media type</h4>
            <label htmlFor="mediaToggle" className="inline-flex items-center w-full border rounded-md cursor-pointer bg-tertiary border-subtle/20">
              <input id="mediaToggle" type="checkbox" className="hidden peer" onChange={(e)=> {
                setContentType(e.target.checked ? 'manga' : 'anime')
              }} />
              <span className="w-1/2 p-1 py-2 text-center bg-accent text-primary peer-checked:text-white peer-checked:bg-transparent rounded-l-md">Anime</span>
              <span className="w-1/2 p-1 py-2 text-center peer-checked:bg-accent peer-checked:text-primary rounded-r-md">Manga</span>
            </label>
          </div>
          <div className='flex flex-col w-full gap-2 p-4 rounded-md bg-secondary'>
            <h4>Categories</h4>
            <div className='flex flex-wrap gap-1'>
              {animeCategoriesLoading && <Loading />}
              {animeCategories?.data.map((category) => {
                return <CategoryPill 
                  category={category} 
                  key={category.slug} 
                  onClick={() => {
                    setListedAnimes([])
                    
                    if (selectedCategories.includes(category.slug)) {                     
                      setSelectedCategories(selectedCategories.filter((c) => c !== category.slug))
                    } else {
                      setSelectedCategories([...selectedCategories, category.slug])
                    }
                  }}
                  selected={selectedCategories.includes(category.slug)}
                />
              })}
            </div>
          </div>
          {scrolled && (
          <div className='fixed flex flex-col w-[calc(25%-1rem)] gap-2 p-4 rounded-md bg-secondary bottom-4'>
            <Button
              Icon={<ArrowUp size={32} className='ml-auto' />}
              onClick={() => document.getElementById('animacontent').scrollTo({ top: 0, behavior: 'smooth' })}
              text={'Back to top'}
              fluid
              tertiary
            />
          </div>  
          )}
        </div>
        <div className='flex flex-col w-3/4 p-4'>
              {animeSearchLoading && <Loading />}
              {(query.length < 3 && selectedCategories.length === 0) ? (
                <span className='flex items-center justify-center w-full h-full text-center text-subtle'>
                  Please select at least one category or type at least 3 characters to search
                </span>
              ) : (
                <div className='-mt-6'>
                  <AnimeGrid 
                    animes={filterAnimesByCategory()} 
                    alwaysShowInfo 
                    animesPerRow={7}
                  />
                  {animeCategoryResult?.data && animeCategoryResult.data.length === 20 && (
                    <div className='flex items-center justify-between w-full p-2 rounded-md bg-secondary'>
                        <Button
                          Icon={<ArrowLeft size={32} className='ml-auto' />}
                          onClick={() => {
                            setPage(categoryPage - 1)
                            refetchCategoryResult()
                          }}
                          disabled={categoryPage === 0}
                        />
                        <Button
                          Icon={<ArrowRight size={32} className='ml-auto' />}
                          onClick={() => {
                            setPage(categoryPage + 1)
                            refetchCategoryResult({
                              exact: false
                            })
                          }}
                          disabled={animeCategoryResult.data.length < 20}
                        />
                    </div>
                  )}
                </div>
              )}
        </div>
      </div>
    </div>
  </General>
}

export default SearchPage
