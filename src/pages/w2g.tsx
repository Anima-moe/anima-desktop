import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { useWebSocket } from 'react-use-websocket/dist/lib/use-websocket'

import i18next from 'i18next'
import { useRouter } from 'next/router'
import { ArrowLeft } from 'phosphor-react'
import { useMap } from 'usehooks-ts'
import { MediaPlayerElement } from 'vidstack'


import Button from '@/components/General/Button'
import Loading from '@/components/General/Loading'
import Media from '@/components/Layout/Media'
import CreateRoomDialog from '@/components/w2g/CreateRoom'
import W2GRoom from '@/components/w2g/Room'
import WatchContainer from '@/components/w2g/Watch'
import { tardisHandler, tardisMessage } from '@/services/anima/tardis'
import { User } from '@/services/anima/user'



interface IW2GProps {}

const W2G: React.FunctionComponent<IW2GProps> = (props) => {
  const [connected, setConnected] = useState(false)
  const [tardisID, setTardisID] = useState(0)
  const [rooms, roomActions] = useMap<number, Anima.TARDIS.Room>()
  const [currentRoom, setCurrentRoom] = useState<Anima.TARDIS.Room>(null)
  const [showNewRoomDialog, setShowNewRoomDialog] = useState(false)

  const setRoom = (num: number, room: Anima.TARDIS.Room) => roomActions.set(num, room)
  const setAllRooms = (roomMap: Map<number, Anima.TARDIS.Room>) => roomActions.setAll(roomMap)
  const resetRooms = () => roomActions.reset()
  const removeRoom = (num: number) => roomActions.remove(num)
  const MediaPlayer = useRef<MediaPlayerElement>(null)
  const router = useRouter()
  const { t } = useTranslation()


  const { sendMessage, lastJsonMessage, readyState, lastMessage, sendJsonMessage, getWebSocket } = useWebSocket(
    `${process.env.NEXT_PUBLIC_TARDIS_URL || 'ws://localhost:8001'}`,
    {
      onOpen: async () => {
        console.log('Connected to Tardis')
        setConnected(true)
        sendMessage(
          tardisMessage('authorize', {
            token: (await User.getUserData()).token,
          })
        )
      },
      onMessage: (event) => {
        const tardis = tardisHandler(event)

        if (!tardis) { return }

        switch (tardis.event) {

          case 'error': {
            toast.error(t('w2g.error.unknown', { error: tardis.data.error }))
            setCurrentRoom(null)
            break
          }

          case 'authorize': {
            if (!tardis.data.user.authorized) { return }

            sendMessage(tardisMessage('getRooms'))
            setTardisID(tardis.data.user.id)
            setInterval(() => {
              sendMessage(tardisMessage('ping', {
                time: Date.now(),
              }))
            }, 1000 * 5.5)

            toast.success(t('w2g.success.authorized'))
            break
          }

          case 'getRooms': {
            setAllRooms(new Map(tardis.data.rooms.map((room) => [room.id, room])))
            break
          }

          case 'createRoom': {
            setRoom(tardis.data.room.id, tardis.data.room)

            if (tardis.data.room.leader === tardisID) { 
              toast.success(t('w2g.success.roomCreated', { room: tardis.data.room.name }))
              setCurrentRoom(tardis.data.room) 
            }
            break
          }

          case 'deleteRoom': {
            if (currentRoom?.id === tardis.data.room.id) {
              toast.info(t('w2g.info.roomDeleted', { room: currentRoom.name })) 
              setCurrentRoom(null) 
            }

            removeRoom(tardis.data.room.id)
            break
          }
        
          case 'joinRoom': {
            const targetRoom = rooms.get(tardis.data.room.id)
            if (!targetRoom) { return }
            

            setRoom(targetRoom.id, {
              ...targetRoom,
              participants: [...targetRoom.participants, tardis.data.user],
            })
            

            if (currentRoom && tardis.data.room.id === currentRoom?.id || tardis.data.user.id === tardisID) {
              toast.info(t('w2g.info.joinedRoom', { name: tardis.data.user.payload.username }))
              
              setCurrentRoom({
                ...targetRoom,
                participants: [...targetRoom.participants, tardis.data.user],
              })
            }
            break
          }

          // This is us. We left the room.
          case 'leaveRoom': {
            setCurrentRoom(null)
            toast.success(t('w2g.success.leftRoom'))
            break
          }

          case 'removeParticipant': {
            const targetRoom = rooms.get(tardis.data.room.id)

            if (!targetRoom) { return }
  
            setRoom(tardis.data.room.id, {
              ...targetRoom,
              participants:[...targetRoom.participants.filter((participant) => (participant.id !== tardis.data.user.id))],
            })
  
            if (tardis.data.user.id === tardisID) {
              setCurrentRoom(null)
            }

            if (tardis.data.room.id === currentRoom?.id) {
              if (tardis.data.user.id !== tardisID) {
                toast.info(t('w2g.info.participantLeft', { name: tardis.data.user.payload.username }))
              }

              setCurrentRoom({
                ...currentRoom,
                participants: [...targetRoom.participants.filter((participant) => (participant.id !== tardis.data.user.id))],
              })
            }

            break
          }

          case 'setRoomLeader': {
            const targetRoom = rooms.get(tardis.data.room.id)

            if (!targetRoom) { return toast.error(t('w2g.error.roomNotFound')) }

            setRoom(tardis.data.room.id, {
              ...targetRoom,
              leader: tardis.data.user.id,
            })

            if (targetRoom.id === currentRoom?.id) {
              toast.info(t('w2g.info.newLeader', { name: tardis.data.user.payload.username }))
              setCurrentRoom({
                ...currentRoom,
                leader: tardis.data.user.id,
              })
            }

            if (tardis.data.user.id === tardisID) {

            }

            break
          }

          case 'requestPlay': {
            if (!MediaPlayer.current) { return }

            if (typeof tardis?.data?.currentTime !== 'number') { return }

            MediaPlayer.current.currentTime = tardis.data.currentTime
            MediaPlayer.current.play().catch((err) => { console.error(`Playback failed for user: ${tardisID} | ${err}`) })

            break
          }

          case 'requestPause': {
            if (!MediaPlayer.current) { return }
  
            if (!tardis.data.currentTime) { return }

            MediaPlayer.current.currentTime = tardis.data.currentTime
            MediaPlayer.current.pause().catch((err) => { console.error(`Playback failed for user: ${tardisID} | ${err}`) })

            break
          }

          case 'requestSeek': {
            if (!tardis.data.currentTime) { return }

            MediaPlayer.current.currentTime = tardis.data.currentTime
            break
          }

          case 'requestSync': {
            if (!tardis.data?.user?.id) { return }
            if (tardis.data.user.id === tardisID) { return }
  
            // We provide the sync data to the server, which will relay to the user
            sendMessage(
              tardisMessage('provideSync', {
                currentTime: MediaPlayer.current?.currentTime,
                playing: MediaPlayer.current?.paused ? false : true, // cant use !!
                user: {
                  id: tardis.data.user.id,
                },
              })
            )
            break
          }

          case 'provideSync': {
            const { currentTime, playing } = tardis.data

            if (!currentTime) { return }
  
            MediaPlayer.current.currentTime = currentTime
  
            if (playing) { MediaPlayer.current.play().catch((err) => { console.error(`Playback failed for user: ${tardisID} | ${err}`) }) }
            break
          }

          case 'chatMessage': {           
            if (!currentRoom) { return }

            const { author, content, room } = tardis.data
            
            if (!author?.id) { return }
            if (typeof room.id !== 'number') { return }
            if (!content) { return }
            if (room.id !== currentRoom.id) { return }

            if (currentRoom?.messages?.length > 0) {
              const previousMessage = currentRoom.messages[currentRoom.messages.length - 1]
              if (previousMessage.author.id === author.id) {
                previousMessage.content = `${previousMessage.content}\n${content}`
                return setCurrentRoom({
                  ...currentRoom,
                  messages: [...currentRoom?.messages || []]
                })
              }
            }

            setCurrentRoom({
              ...currentRoom,
              messages: [...currentRoom?.messages || [], {
                author,
                content
              }]
            })
          }

          case 'requestChangeEpisode': {
            const { episode, room } = tardis.data
            if (!episode?.id || typeof room?.id !== 'number') { return }
            if (room.id !== currentRoom?.id) { return } // How the fuck did we get that? probably won't, but still....
            setRoom(room.id, {
              ...currentRoom,
              episodeID: episode.id
            })
            setCurrentRoom({
              ...currentRoom,
              episodeID: episode.id
            })

            toast.info(t('w2g.info.episodeChanged'))
            break
          }
          default: {
            console.log(`Received unexpected event: ${tardis.event}`)
          }
        }

      },
    }
  )

  useEffect(() => {
    if (!MediaPlayer.current) {
      return
    }
    if (!currentRoom || !currentRoom.leader) {
      return
    }
    if (currentRoom.leader !== tardisID) {
      return
    }

    MediaPlayer.current.addEventListener('seeked', (e) => {
      sendMessage(
        tardisMessage('requestSeek', {
          currentTime: MediaPlayer.current?.currentTime,
        })
      )
    })

    MediaPlayer.current.addEventListener('play', (e) => {
      sendMessage(
        tardisMessage('requestPlay', {
          currentTime: MediaPlayer.current?.currentTime,
        })
      )
    })

    MediaPlayer.current.addEventListener('pause', (e) => {
      sendMessage(
        tardisMessage('requestPause', {
          currentTime: MediaPlayer.current?.currentTime,
        })
      )
    })
  }, [MediaPlayer.current, currentRoom?.leader])

  if (!connected) {
    return <Media fluid>
      <div className='flex items-center justify-center w-screen h-screen'>
        <Loading />
      </div>
    </Media>
  }

  return (
    <Media fluid>
      <div className="flex w-full h-full">
        <div className="flex flex-col w-full p-8 h-min">
          <div className="flex items-center gap-4 mb-8 text-4xl font-semibold">
            <Button
              text=""
              Icon={<ArrowLeft weight="duotone" size={32} />}
              subtle
              className="flex aspect-square !h-12 !w-12 items-center justify-center !rounded-md border border-dashed border-subtle/10 p-2 hover:!bg-accent hover:!text-primary"
              onClick={() => {
                router.push('/')
              }}
            />
            Watch Together <span className="px-2 py-1 text-xs font-semibold rounded-md bg-secondary text-accent">ALPHA</span>
            <CreateRoomDialog 
              onOpenChange={setShowNewRoomDialog}
              showDialog={showNewRoomDialog}
              onEpisodeSelect={ (episode, roomName) => {
                setShowNewRoomDialog(false)
                sendMessage(
                  tardisMessage('createRoom', {
                    room: {
                      episode,
                    },
                    episodeID: episode.id,
                    name: roomName
                  })
                )
              }}
            />
          </div>
          <div className='grid grid-cols-4 gap-4'>
            {Array.from(rooms?.values()).map((room) => {
              return (
                <W2GRoom
                  room={room}
                  key={room.id}
                  onClick={() => {
                    sendMessage(
                      tardisMessage('joinRoom', {
                        room: {
                          id: room.id,
                        },
                        user: {
                          id: tardisID,
                        },
                      })
                    )
                  }}
                />
              )
            })}
          </div>
        </div>
      </div>
      {currentRoom && (
        <WatchContainer
          room={currentRoom}
          selfID={tardisID}
          onLeaveRoom={ () => { sendMessage(tardisMessage('leaveRoom', { room: { id: currentRoom.id, }, user: { id: tardisID, } })) } }
          onSendChatMessage={ message => { sendMessage(tardisMessage('chatMessage', { content: message, room: { id: currentRoom.id }})) }}
          onSync={ () => {
            sendMessage(tardisMessage('requestSync', { user: { id: tardisID }, room: { id: currentRoom.id } }))
          }}
          onChangeLeader={ newLeaderID => {
            sendMessage(tardisMessage('requestChangeLeader', { user: { id: newLeaderID }, room: { id: currentRoom.id } }))
          }}
          onKickParticipant={ participantID => {
            sendMessage(tardisMessage('requestKickParticipant', { user: { id: participantID }, room: { id: currentRoom.id } }))
          }}
          onEpisodeChange={ episodeID => {
            sendMessage(tardisMessage('requestChangeEpisode', { episode: { id: episodeID }, room: { id: currentRoom.id } }))
          }}
          ref={MediaPlayer}
        />
      )}
      
    </Media>
  )
}


export default W2G
