import AnimeSwiper from '@/components/Anime/AnimeSwiper'
import { Anime } from '@/services/anima/anime'
import { Category } from '@/services/anima/category'
import Loading from '@/components/General/Loading'
import i18next, { t } from 'i18next'
import { useState, useCallback, useEffect } from 'react'
import CategoryPill from '@/components/Category/CategoryPill'
import AnimeGrid from '@/components/Anime/AnimeGrid'
import { AnimatePresence, motion } from 'framer-motion'
import { useQuery } from 'react-query'

// With those functions we avoid re-fetching the data when the requires inputs are either invalid or doesn't meet the criteria.
async function getCategoryAnimes(categories: Anima.RAW.Category[], start: number = 0) {  
  if (categories.length === 0) return  {data:[], count:0} as Anima.API.GetAnimes
  return await Anime.getByCategories(categories.map((c)=>c.slug), start)
}

async function getSearchResult(query: string) {
  if (!query || query.length < 3) return {data:[], count:0} as Anima.API.SearchAnimes
  return await Anime.search(query)
}

type Props = {
  query?: string
}

function SearchPortal({query = ''}: Props) {
  const [categoryAnimes, setCategoryAnimes] = useState<Anima.API.GetAnimes>({data:[], count:0})
  const [selectedCategory, setSelectedCategory] = useState<Anima.RAW.Category[]>([])
  const {data: searchResult, error: searchError, isLoading: searchLoading} = useQuery<Anima.API.SearchAnimes>(`/api/search/${query}`, ()=>{return getSearchResult(query)})
  const {data: categories, error: categoriesError, isLoading: categoriesLoading} = useQuery<Anima.API.GetCategories>(`/api/categories`, ()=>{return Category.getAll(i18next.language)})

  const fetchCategoryAnimes = useCallback(()=>{
    if (query.length > 1) { return }

    setCategoryAnimes({data:[], count:0})
    getCategoryAnimes(selectedCategory).then((data)=>setCategoryAnimes(data))
  },[selectedCategory.join(',')])
  useEffect(fetchCategoryAnimes, [fetchCategoryAnimes])

  const appendCategoryAnimes = ()=>{
    getCategoryAnimes(selectedCategory, categoryAnimes.data.length)
    .then((data)=>{
      setCategoryAnimes({
        data: [...categoryAnimes.data, ...data.data],
        count: data.count
      })
    })
  }

  return <div className='fixed left-0 top-0 w-full h-full bg-primary bg-opacity-95 z-[2] flex px-32 pt-[11rem] pb-8 flex-col backdrop-blur-md'>
      <div className='flex w-full relative h-full flex-col'>
        {/* DISPLAY AVAILABLE CATEGORIES FOR THIS LOCALE */}
        {categories?.data.length > 0 && (
        <AnimatePresence>
            <motion.div 
              initial={{opacity: 0, y: -20}}
              animate={{opacity: 1, y: 0}}
              transition={{
                delay: .25,
                duration: .15,
                type: 'spring',
                stiffness: 500,
                damping: 60,
                mass: 1
              }}
              className='flex flex-row flex-wrap mb-4'
            >
                {categories?.data.map((category, index) => (
                  <CategoryPill 
                    category={category} 
                    key={`category.${i18next.language}.${category.slug}`} 
                    selected={
                      selectedCategory.some((c)=> c.slug === category.slug)
                    }
                    onClick={() => {
                      if(selectedCategory.length === 1 && selectedCategory[0].slug === category.slug) {
                        setSelectedCategory([])
                        return
                      }

                      if (selectedCategory.some((c)=> c.slug === category.slug)) {
                        setSelectedCategory(selectedCategory.filter((c)=> c.slug !== category.slug))
                      } else {
                        setSelectedCategory([...selectedCategory, category])
                      }
                    }}
                  />
                ))}
            </motion.div>
          </AnimatePresence>
        )}

        {/* LOADING ANIMES */}
        {searchLoading || categoriesLoading && <div className='w-full flex items-center justify-center mt-32'>
          <Loading/>
        </div>}

        {/* DISPLAY SEARCH RESULTS */}
        {(searchResult?.data?.length > 0) && (
          <AnimeSwiper 
            animes={searchResult.data.filter((anime)=> {
              if (selectedCategory.length < 1) return true
              return anime.Category.some((category) => selectedCategory.map((c) => c.slug).includes(category.slug))
            })} 
            animesPerScreen={7} 
            alwaysShowInfo
          /> 
        )}

        {/* DISPLAY CATEGORY ANIMES */}
        {(selectedCategory.length > 0 && categoryAnimes?.data?.length > 0) && (query.length < 1) && (
          <AnimeGrid  
            animes={categoryAnimes.data} 
            onHitBottom={appendCategoryAnimes} 
            hasMore={categoryAnimes.count === 20} 
            alwaysShowInfo animesPerRow={7} 
          />
        )}

        {/* DISPLAY NO QUERY */}
        {(!query && selectedCategory.length < 1) && (
          <span className='text-xs text-subtle w-full flex items-center justify-center mt-32'>{t('search_moredata')}</span> 
        )}

        {/* DISPLAY ERROR */}
        {(categoriesError || searchError) && (
          <span className='text-xs text-red-400 font-semibold w-full flex items-center justify-center mt-32'>{t('api_fetchError')}</span>
        )}

      </div>
  </div>
}

export default SearchPortal