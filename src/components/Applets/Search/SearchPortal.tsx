import { useState, useCallback, useEffect } from 'react'
import { useQuery } from 'react-query'

import { AnimatePresence, motion } from 'framer-motion'
import i18next, { t } from 'i18next'
import { useAtom } from 'jotai'
import { useRouter } from 'next/router'

import AnimeGrid from '@/components/Anime/AnimeGrid'
import AnimeSwiper from '@/components/Anime/AnimeSwiper'
import CategoryPill from '@/components/Category/CategoryPill'
import Loading from '@/components/General/Loading'
import { Anime } from '@/services/anima/anime'
import { Category } from '@/services/anima/category'
import { displaySearchPortal } from '@/stores/atoms'

// With those functions we avoid re-fetching the data when the requires inputs are either invalid or doesn't meet the criteria.
async function getCategoryAnimes(categories: Anima.RAW.Category[], start: number = 0) {
  if (categories.length === 0) return { data: [], count: 0 } as Anima.API.GetAnimes
  return await Anime.getByCategories(
    categories.map((c) => c.slug),
    start
  )
}

async function getSearchResult(query: string) {
  if (!query || query.length < 3) return { data: [], count: 0 } as Anima.API.SearchAnimes
  return await Anime.search(query)
}

type Props = {
  query?: string
}

function SearchPortal({ query = '' }: Props) {
  const [categoryAnimes, setCategoryAnimes] = useState<Anima.API.GetAnimes>({ data: [], count: 0 })
  const [selectedCategory, setSelectedCategory] = useState<Anima.RAW.Category[]>([])
  const {
    data: searchResult,
    error: searchError,
    isLoading: searchLoading,
  } = useQuery<Anima.API.SearchAnimes>(`/api/search/${query}`, () => {
    return getSearchResult(query)
  })
  const {
    data: categories,
    error: categoriesError,
    isLoading: categoriesLoading,
  } = useQuery<Anima.API.GetCategories>('/api/categories', () => {
    return Category.getAll(i18next.language)
  })
  const [displaySearchbar, setDisplaySearchbar] = useAtom(displaySearchPortal)
  const router = useRouter()

  const fetchCategoryAnimes = useCallback(() => {
    if (query.length > 1) {
      return
    }

    setCategoryAnimes({ data: [], count: 0 })
    getCategoryAnimes(selectedCategory).then((data) => setCategoryAnimes(data))
  }, [selectedCategory.join(',')])
  useEffect(fetchCategoryAnimes, [fetchCategoryAnimes])

  const appendCategoryAnimes = () => {
    getCategoryAnimes(selectedCategory, categoryAnimes.data.length).then((data) => {
      setCategoryAnimes({
        data: [...categoryAnimes.data, ...data.data],
        count: data.count,
      })
    })
  }

  return (
    <div className="fixed left-0 top-0 z-[10] flex h-full w-full flex-col bg-primary bg-opacity-95 px-4 pt-[11rem] backdrop-blur-md">
      <div className="relative flex h-full w-full max-w-[85rem] mx-auto flex-col">
        {/* DISPLAY AVAILABLE CATEGORIES FOR THIS LOCALE */}
        {categories?.data.length > 0 && (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.2,
                duration: 0.1,
                type: 'spring',
                stiffness: 500,
                damping: 60,
                mass: 1,
              }}
              className="flex flex-row flex-wrap "
            >
              {categories?.data.map((category, index) => (
                <CategoryPill
                  category={category}
                  key={`category.${i18next.language}.${category.slug}`}
                  selected={selectedCategory.some((c) => c.slug === category.slug)}
                  onClick={() => {
                    if (
                      selectedCategory.length === 1 &&
                      selectedCategory[0].slug === category.slug
                    ) {
                      setSelectedCategory([])
                      return
                    }

                    if (selectedCategory.some((c) => c.slug === category.slug)) {
                      setSelectedCategory(selectedCategory.filter((c) => c.slug !== category.slug))
                    } else {
                      setSelectedCategory([...selectedCategory, category])
                    }
                  }}
                />
              ))}
            </motion.div>
          </AnimatePresence>
        )}

        {/* DISPLAY SEARCH RESULTS */}
        {searchResult?.data?.length > 0 && (
          <AnimeGrid
            animes={searchResult.data.filter((anime) => {
              if (selectedCategory.length === 0) return true
              return compareArrays(
                anime.Category.map((c) => c.slug),
                selectedCategory.map((c) => c.slug)
              )
            })}
            alwaysShowInfo
            animesPerRow={7}
            key={`category.${i18next.language}.${selectedCategory
              .map((c) => c.slug)
              .join(',')}.${query}`}
            onAnimeSelect={(anime) => {
              setDisplaySearchbar(false)
              router.push(`/anime/${anime.id}`)
              router.events.on('routeChangeComplete', () => {
                setDisplaySearchbar(false)
              })
            }}
          />
        )}

        {/* DISPLAY CATEGORY ANIMES */}
        {selectedCategory.length > 0 && categoryAnimes?.data?.length > 0 && query.length < 1 && (
          <AnimeGrid
            animes={categoryAnimes.data}
            onHitBottom={appendCategoryAnimes}
            hasMore={categoryAnimes.count === 20}
            alwaysShowInfo
            animesPerRow={7}
            key={`category.${i18next.language}.${selectedCategory
              .map((c) => c.slug)
              .join(',')}.${query}`}
            onAnimeSelect={(anime) => {
              setDisplaySearchbar(false)
              router.push(`/anime/${anime.id}`)
              router.events.on('routeChangeComplete', () => {
                setDisplaySearchbar(false)
              })
            }}
          />
        )}

        {/* LOADING ANIMES */}
        {searchLoading ||
          (categoriesLoading && (
            <div className="mt-32 flex w-full items-center justify-center">
              <Loading md />
            </div>
          ))}

        {/* DISPLAY NO RESULTS */}
        {((query && searchResult?.count < 1) ||
          (selectedCategory.length > 0 && categoryAnimes.count < 1)) && (
          <span className="mt-32 flex w-full items-center justify-center text-xs text-subtle">
            {t('search_noresult')}
          </span>
        )}

        {/* DISPLAY NO QUERY */}
        {!query && selectedCategory.length < 1 && (
          <span className="mt-32 flex w-full items-center justify-center text-xs text-subtle">
            {t('search_moredata')}
          </span>
        )}

        {/* DISPLAY ERROR */}
        {(categoriesError || searchError) && (
          <span className="mt-32 flex w-full items-center justify-center text-xs font-semibold text-red-400">
            {t('api_fetchError')}
          </span>
        )}
      </div>
    </div>
  )
}

export default SearchPortal

function compareArrays(array1: string[], array2: string[]) {
  return array2.every((value) => array1.includes(value))
}
