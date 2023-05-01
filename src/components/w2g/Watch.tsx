import { forwardRef, useEffect, useRef, useState } from 'react'
import { useQuery } from 'react-query'

import clsx from 'clsx'
import { useAtom } from 'jotai'
import { ArrowLeft, Crown, Door, SignOut, Trash } from 'phosphor-react'
import { MediaPlayerElement } from 'vidstack'


import Button from '@/components/General/Button'
import Player from '@/components/w2g/Player'
import { Episode } from '@/services/anima/episode'
import { userPreferedPlayerMode } from '@/stores/atoms'
import * as Portal from '@radix-ui/react-portal'

import UserComments from '../Comments/CommentBlock'
import Chat from './Chat'


function fetcComments(episodeID: string, skipComments = 0) {
  if (!episodeID) return
  return Episode.getComments(Number(episodeID), skipComments, 10)
}

interface IAppProps {
  room: Anima.TARDIS.Room
  selfID: number
  onLeaveRoom?: () => void
  onChangeLeader?: (newLeader: number) => void
  onKickParticipant?: (participant: number) => void
  onSync?: () => void
  onSendChatMessage?: (message: string) => void
  onEpisodeChange?: (episodeID: number) => void
}

const queryOptions = {
  cacheTime: 0,
  retry: 3,
  refetchOnWindowFocus: false,
}


const WatchContainer = forwardRef<MediaPlayerElement, IAppProps>(({ room, onLeaveRoom, onChangeLeader, onSync, onSendChatMessage, selfID, onKickParticipant, onEpisodeChange }, ref) => {
    const [playerMode] = useAtom(userPreferedPlayerMode)
    const [commentsPage, setcommentsPage] = useState(0)
    const { data: commentsData, isLoading: loadingComments, refetch: refecthComments, } = useQuery(`episode/${room.episodeID}/comments`, () => fetcComments(String(room.episodeID), commentsPage * 10), queryOptions)

    return <Portal.Root className={clsx({
      'absolute top-10 flex h-[calc(100vh-40px)] w-full flex-col gap-4 bg-primary p-8 overflow-x-hidden overflow-y-auto rounded-b-lg': true,
      '!mt-0 !p-0 !top-0 !w-screen !h-screen': playerMode === 'expanded',
    })}>
        <div className={clsx({
          'flex items-center justify-between w-full gap-2': true,
          'hidden': playerMode === 'expanded'
        })}>
          <div className="flex items-center gap-4 text-2xl font-semibold">
          <Button
            text=""
            Icon={<ArrowLeft weight="duotone" size={24} />}
            subtle
            className="flex aspect-square !h-12 !w-12 items-center justify-center !rounded-md border border-dashed border-subtle/10 p-2 hover:!bg-accent hover:!text-primary"
            onClick={onLeaveRoom}
          />
          <span>#{room.id}</span>
          {room.name || 'Unamed Room'}
          </div>
        </div>
        <div className={clsx({
          'flex w-full gap-4': true,
          'flex-col': playerMode === 'expanded'
        })}>
          <div className={clsx({
            'w-2/3': playerMode === 'normal',
            'w-full': playerMode === 'expanded'
          })}>
            <Player
              episodeID={String(room.episodeID)}
              ref={ref}
              leaderControls={room.leader === selfID}
              onReady={() => {
                if (room.leader === selfID) { return }

                if (selfID !== room.leader) {
                  return onSync?.()
                }
              }}
              onSourceChange={(source) => {
                if (room.leader !== selfID) {
                  return onSync?.()
                }
                onEpisodeChange?.(source)
              }}
            />
            <div className='mt-12'>
              <UserComments 
                Comments={commentsData?.data}
                episodeID={room.episodeID}
                onComment={() => {
                  refecthComments()
                }}
              />
            </div>
          </div>
          <div className={clsx({
            'flex flex-col w-1/3 h-full': true,
            '!w-full': playerMode === 'expanded'
          })}>
            <Chat
              self={selfID}
              room={room}
              onSendMessage={onSendChatMessage}
            />
            <div className='flex flex-col w-full gap-2 my-6 max-h-[400px] overflow-y-auto'>
              {room.participants?.map((participant) => {
                return <div key={participant.id} className='flex items-center w-full gap-2 p-2 rounded-md bg-secondary'>
                  <div 
                    className='relative w-12 h-12 bg-center bg-cover rounded-md aspect-square bg-tertiary'
                    style={{backgroundImage: `url('${participant?.payload?.profile?.avatar}')`}}
                  >
                    {participant.id === room.leader && <div className='bg-center bg-cover w-3 h-3 bg-[url(/badges/owner.png)] absolute -right-1 -top-1' />}
                  </div>
                  <div className='flex flex-col w-full'>
                    <span className='font-semibold' style={{color: participant?.payload?.profile?.color}}>
                      {participant.payload.username}
                    </span>
                    <span className='text-xs text-subtle'>
                    {participant.id === room.leader ? 'Leader' : 'Member'}
                    </span>
                  </div>
                  {(selfID === room.leader) && (selfID !== participant.id) && <>
                    <Button
                      Icon={<Crown weight='duotone' size={16} />}
                      text=''
                      subtle
                      tertiary
                      className='!rounded-md !p-2 hover:!bg-yellow-400 hover:!text-primary'
                      onClick={()=>{
                        onChangeLeader?.(participant.id)
                      }}
                    />
                    <Button
                      Icon={<Door weight='duotone' size={16} />}
                      text=''
                      subtle
                      tertiary
                      className='!rounded-md !p-2 hover:!bg-red-400 hover:!text-primary'
                      onClick={()=>{
                        onKickParticipant?.(participant.id)
                      }}
                    />
                  </>}
                </div>
              })}
            </div>
          </div>
        </div>
      </Portal.Root>
  })

WatchContainer.displayName = 'WatchContainer'

export default WatchContainer
