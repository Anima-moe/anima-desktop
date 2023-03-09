import { createRef, useEffect, useState } from 'react'
import { useQuery } from 'react-query'

import clsx from 'clsx'
import i18next from 'i18next'
import { useAtom } from 'jotai'
import { useRouter } from 'next/router'
import type { MediaPlayerElement } from 'vidstack'

import UserCommentBlock from '@/components/Comments/CommentBlock'
import StreamError from '@/components/Error/StreamError'
import Loading from '@/components/General/Loading'
import General from '@/components/Layout/General'
import MediaLayout from '@/components/Layout/Media'
import Player from '@/components/Player'
import usePresence from '@/hooks/usePresence'
import { Anime } from '@/services/anima/anime'
import { Episode } from '@/services/anima/episode'
import { Season } from '@/services/anima/season'

import { userPreferedPlayerMode } from '../../stores/atoms'

function fetchStreams(episodeID?: string) {
  if (!episodeID) return
  return Episode.getStreams(Number(episodeID))
}

function fetchEpisode(episodeID?: string) {
  if (!episodeID) return
  return Episode.get(Number(episodeID))
}

function fetchSeason(seasonID?: number) {
  if (!seasonID) return
  return Season.get(Number(seasonID), i18next.language)
}

function fetchAnime(animeID?: number) {
  if (!animeID) return
  return Anime.get(Number(animeID))
}

function fetcComments(episodeID: string, skipComments = 0) {
  if (!episodeID) return
  return Episode.getComments(Number(episodeID), skipComments, 10)
}

const queryOptions = {
  cacheTime: 0,
  retry: 3,
  refetchOnWindowFocus: false,
}

function Index() {
  const router = useRouter()
  const mediaPlayer = createRef<MediaPlayerElement>()
  const [commentsPage, setcommentsPage] = useState(0)
  const [playerExpanded] = useAtom(userPreferedPlayerMode)
  const { data: episodeData, isLoading: episodeLoading, error: episodeError, } = useQuery(`/api/episode/${router.query.id}`, () => fetchEpisode(router.query.id as string), queryOptions)
  const { data: seasonData, isLoading: seasonLoading, error: seasonError, } = useQuery(`/api/season/${episodeData?.data?.season_id}`, () => fetchSeason(episodeData?.data?.season_id), queryOptions)
  const { data: animeData, isLoading: animeLoading, error: animeError, } = useQuery(`/api/anime/${seasonData?.data?.[0]?.anime_id}`, () => fetchAnime(seasonData?.data?.[0].anime_id), queryOptions)
  const { data: streamData, isLoading: streamLoading,error: streamError, } = useQuery(`/api/episode/${router.query.id}/streams`, () => fetchStreams(router.query.id as string), queryOptions)
  const { data: commentsData, isLoading: loadingComments, refetch: refecthComments, } = useQuery(`episode/${router.query.id}/comments`, () => fetcComments(router.query.id as string, commentsPage * 10), queryOptions)

  const { setPresence } = usePresence()

  const contentWrapper = clsx({
    'duration-200 transition-all relative rounded-md overflow-hidden': true,
    'w-[calc(85vh*1.77)] flex gap-4': playerExpanded !== 'expanded',
    'w-screen h-full': playerExpanded === 'expanded',
  })

  if (animeLoading || seasonLoading || episodeLoading || streamLoading) {
    return <General>
      <div className='w-screen h-screen flex items-center justify-center'>
        <Loading lg inline/>
      </div>
    </General>
  }

  if (!animeData || !seasonData || !episodeData || !streamData) {
    return <General>
      <div className='w-screen h-screen flex items-center justify-center'>
        <StreamError error={btoa(JSON.stringify({
          anime:  router?.query?.id,
          season: seasonData?.data?.[0]?.id,
          episode: episodeData?.data?.id,
          source: streamData?.data?.source,
          error: `${episodeError || seasonError || animeError || streamError}`
        }))}/>
      </div>
    </General>
  }

  return (
    <MediaLayout>
      <div className="flex h-min w-full flex-col items-center gap-4 overflow-hidden">
        <div className={contentWrapper}>
          <Player animeData={animeData.data} episodeData={episodeData.data} seasonData={seasonData.data[0]} streamData={streamData.data}  />
        </div>
          <div className={contentWrapper}>
            <UserCommentBlock
              episodeID={episodeData?.data.id}
              Comments={commentsData.data}
              onComment={() => {
                refecthComments()
              }}
            />
          </div>
      </div>
    </MediaLayout>
  )
}

export default Index
