import { useState, useCallback, useEffect } from 'react'
import { useQuery } from 'react-query'

import { AnimatePresence, motion } from 'framer-motion'
import i18next, { t } from 'i18next'
import { useAtom } from 'jotai'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { FilmStrip, Funnel, MagnifyingGlass, UserFocus } from 'phosphor-react'
import { debounce } from 'ts-debounce'

import AnimeGrid from '@/components/Anime/AnimeGrid'
import CategoryPill from '@/components/Category/CategoryPill'
import Button from '@/components/General/Button'
import IconInput from '@/components/General/Inputs/IconTextInput'
import Loading from '@/components/General/Loading'
import SectionTitle from '@/components/General/SectionTitle'
import FloatingProfile from '@/components/User/FloatingProfile'
import UserBadge from '@/components/User/UserBadge'
import { Anime } from '@/services/anima/anime'
import { Category } from '@/services/anima/category'
import { User } from '@/services/anima/user'
import { displaySearchPortal } from '@/stores/atoms'
import * as Tooltip from '@radix-ui/react-tooltip'

async function searchUsers(query: string) {
  if (!query || query.length < 3) return
  return await User.search(query)
}

async function searchAnimes(query: string) {
  if (!query || query.length < 3) return

  return await Anime.search(query)
}

function SearchPortal() {
  const [focused, setFocused] = useAtom(displaySearchPortal)
  const [query, setQuery] = useState('')
  const router = useRouter()
  const { data: animeSearchResult, isLoading: animeSearchLoading, error: animeSearchError, refetch: refetchAnimeSearch } = useQuery(`anime/search/${query}`, () => searchAnimes(query), { refetchOnWindowFocus: false  })
  const { data: userSearchResult, isLoading: userSearchLoading, error: userSearchError, refetch: refetchUserSearch } = useQuery(`user/search/${query}`, () => searchUsers(query), { refetchOnWindowFocus: false  })

  const handleStart = () => {
    setFocused(false)
  }

  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      setFocused(false)
    }
  }

  useEffect(()=>{
    router.events.on('routeChangeStart', handleStart)
    document.body.addEventListener('keyup', handleKeyPress)
    return () => {
      router.events.off('routeChangeStart', handleStart)
      document.body.removeEventListener('keyup', handleKeyPress)
    }
  }, [])

  if (animeSearchError || userSearchError) {
    return <div className="fixed left-0 top-0 z-[10] pt-[5rem] flex h-full w-full flex-col bg-primary bg-opacity-95 px-4 backdrop-blur-md">
        Error
    </div>
  }

  const debouncedQuery = debounce(setQuery, 300)

  const beautyNumber = (number: number) => {
    if (number < 10) return `00${number}`
    if (number < 100) return `0${number}`
    return number
  }


  return (
    <div 
      className="fixed inset-0 pt-[10rem] flex h-screen max-h-[100vh] z-[10] w-full bg-primary/95 flex-col backdrop-blur-md overflow-hidden items-center select-none"
      id="portal"
    >
      <div className='flex items-center justify-center w-[60%] gap-4'>
        <IconInput 
          type="text"
          className="px-4 py-2 text-white rounded-md border-subtle/20"
          onChange={(e) => {
            debouncedQuery(e.target.value)
          }}
          Icon={MagnifyingGlass}
          placeholder={t('nav.search.placeholder')}
        />
        <Button 
          Icon={<Funnel />}
          secondary
          className='hover:!bg-accent hover:!text-primary border !border-subtle/10 aspect-square'
          onClick={()=>{
            router.push(`/search?query=${query}`)
          }}
        />
      </div>
      {(!query || query.length < 3) ? (
        <div className="flex h-full text-subtle">
          <span className='mt-16'>{t('nav.search.error.short')}</span>
        </div>
      ) : (
        (animeSearchLoading && !userSearchResult) || (userSearchLoading && !animeSearchResult) ? (
          <div className="flex">
            <Loading />
          </div>
        ) : (
          <div className='flex flex-col w-full h-full gap-8 px-8 mt-4 overflow-x-hidden overflow-y-scroll'>
            {userSearchResult && userSearchResult.data.length > 0 && <div className='flex flex-col w-full gap-4'>
              <SectionTitle name='Users' Icon={UserFocus} />
              <div className='grid w-full grid-cols-5 gap-4 2xl:grid-cols-6'>
                {userSearchResult.data.map((user) => (
                  <Tooltip.Provider delayDuration={300} key={`user.link.${user.id}`}>
                    <Tooltip.Root>
                      <Tooltip.Trigger>
                        <Link href={`/user/${user.id}`} >
                          <div 
                            className='relative flex min-w-[250px] w-full gap-2 p-2 overflow-hidden rounded-md bg-secondary'
                            key={`user.results.${user.id}`}
                          >
                            <div className='absolute inset-0 w-full h-full opacity-5'  style={{background: user?.profile?.color}} /> 
                            <div className='relative flex flex-col w-full' >
                              <div className='flex items-center w-full gap-2 overflow-hidden font-semibold text-ellipsis whitespace-nowrap'>
                                <span className='p-1 px-2 mr-2 text-xs rounded-md h-min text-secondary' style={{background: user?.profile?.color}}>#{beautyNumber(user.id)}</span>
                                <h2 className='w-full py-1 overflow-hidden text-lg font-semibol text-ellipsis text-start' style={{color: user?.profile?.color}}>{user.username}</h2>
                              </div>
                            </div>
                          </div>
                        </Link>
                        </Tooltip.Trigger>
                        <FloatingProfile user={user} side='bottom' />
                      </Tooltip.Root>
                    </Tooltip.Provider>
                  ))}
              </div>              
            </div>}

            {animeSearchResult && animeSearchResult.data.length > 0 && <div className='flex flex-col w-full gap-4'>
              <SectionTitle name='Animes' Icon={FilmStrip} />
              <AnimeGrid 
                animes={animeSearchResult.data} 
                alwaysShowInfo 
                animesPerRow={8} 
                onHitBottom={()=>{

                }}
              />
            </div>}
          </div>
        )
      )}
    </div>
  )
}

export default SearchPortal

function compareArrays(array1: string[], array2: string[]) {
  return array2.every((value) => array1.includes(value))
}
