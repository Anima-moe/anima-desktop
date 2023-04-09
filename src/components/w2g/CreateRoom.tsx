import { useRef, useState } from 'react'
import { useQuery } from 'react-query'

import { Cube, MagnifyingGlass, Plus } from 'phosphor-react'
import { debounce } from 'ts-debounce'

import Button from '@/components/General/Button'
import EmojiOptionsInput from '@/components/General/Inputs/EmojiSelectionInput'
import IconInput from '@/components/General/Inputs/IconTextInput'
import { Anime } from '@/services/anima/anime'
import { getLocaleMetadata } from '@/services/anima/getMetadataFromMedia'
import * as Dialog from '@radix-ui/react-dialog'

import AnimeCard from '../Anime/AnimeCard'
import Season from '../Anime/Season'

interface ICreateRoomDialogProps {
  showDialog?: boolean
  onOpenChange?: (open: boolean) => void
  onEpisodeSelect?: (episode: Anima.RAW.Episode, roomName: string) => void
}

async function searchAnimes(query: string) {
  if (!query || query.length < 3) return

  return await Anime.search(query)
}

async function getAnime(id: number) {
  if (typeof id !== 'number') { return }

  return await Anime.get(id)
}

const CreateRoomDialog: React.FunctionComponent<ICreateRoomDialogProps> = ({ showDialog, onOpenChange, onEpisodeSelect }) => {
  const [selectedAnime, setSelectedAnime] = useState<Anima.RAW.Anime>(null)
  const [searchQuery, setQuery] = useState('')
  const roomName = useRef('')
  const roomPrivate = useRef(false)

  const { data: animeSearchResult, isLoading: animeSearchLoading, error: animeSearchError, refetch: refetchAnimeSearch } = useQuery(`anime/search/${searchQuery}`, () => searchAnimes(searchQuery), { refetchOnWindowFocus: false  })
  const { data: animeData, isLoading: animeLoading, error: animeError, refetch: refetchAnime } = useQuery(`anime/${selectedAnime?.id}`, () => getAnime(selectedAnime?.id), { refetchOnWindowFocus: false  })
  
  const debouncedSetQuery = debounce(query => {
    setSelectedAnime(null)
    setQuery(query)
  }, 300)

  
  return <Dialog.Root open={showDialog} onOpenChange={state => {
    onOpenChange?.(state)
    if (!state) { 
      setSelectedAnime(null)
      setQuery('')
      
    }
  }}>
  <Dialog.Trigger className='ml-auto w-min' asChild>
    <div>
      <Button
        text="New Room"
        Icon={<Plus weight="duotone" size={16} />}
        className="flex w-min items-center justify-center whitespace-nowrap !rounded-md"
        sm
        secondary
        iconLeft
      />
    </div>
  </Dialog.Trigger>
  <Dialog.Portal>
    <Dialog.Overlay className="bg-primary/80 backdrop-blur-md fixed inset-0 data-[state=open]:animate-overlayShow" />
    <Dialog.Content className="fixed top-1/2 left-1/2 max-h-[85vh] w-[90vw] max-w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-md bg-secondary p-6 shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none data-[state=open]:animate-contentShow z-[2] overflow-scroll">
      <Dialog.Title className="m-0 text-lg font-medium text-white/80">Create new room</Dialog.Title>
      <Dialog.Description className="flex flex-col pb-4 mb-6 text-sm leading-normal border-b text-subtle border-b-subtle/10">
        Creating a new room allows you to watch video with your friends and/or other anima users.
      </Dialog.Description>
      <div className='flex flex-col gap-3'>
        <TitleInput
          id='room-name'
          title='Room Name'
        >
          <IconInput 
            Icon={Cube}
            placeholder="My Cool Room"
            onChange={e=>{
              roomName.current = e.target.value
            }}
          />
        </TitleInput>
        <TitleInput
          id='room-privacy'
          title='Room Privacy'
          footer='Private rooms are only visible to you and your friends.'
        >
          <EmojiOptionsInput 
            options={[
              { label: 'Public', value: 'public', emoji: '🔓' },
              { label: 'Private', value: 'private', emoji: '🔒' },
            ]}
            onSelect={value => {
              roomPrivate.current = value === 'private'
            }}
          />
        </TitleInput>
          <TitleInput
            id='anime-search'
            title='Media'
            footer='Search & Select the anime you want to watch.'
          >
            <IconInput 
              Icon={MagnifyingGlass}
              placeholder="Eg: Bocchi The Rock"
              onChange={(e) => {
                debouncedSetQuery(e.target.value)
              }}
            />
        </TitleInput>
        <div className='flex w-full h-full mb-6 overflow-hidden'>
            {animeSearchResult && !selectedAnime && (
              <ul className='relative flex flex-col w-full h-full gap-2 overflow-y-scroll'>
                {animeSearchResult.data.map((anime) => {
                  return <li 
                    key={`anime.${anime.id}`}
                    className='flex items-center w-full gap-3 p-1 rounded-md cursor-pointer bg-tertiary hover:bg-accent hover:text-primary'
                    onClick={()=>{
                      setSelectedAnime(anime)
                    }}
                  >
                    <div className='w-8 pointer-events-none'>
                      <AnimeCard disabled noHover anime={anime} />
                    </div>
                    {getLocaleMetadata<Anima.RAW.Anime, Anima.RAW.AnimeMetadata>(anime)?.title || 'Unknown Title'}
                  </li>
                })}
              </ul>
            )}
            {selectedAnime && animeData && (
              <Season 
                seasons={animeData.data.AnimeSeason}
                onEpisodeSelect={episode =>{
                  onEpisodeSelect(episode, roomName.current)
                }}
                episodesPerRow={2}
              />
            )}
        </div>
      </div>
      <span className='text-xs text-subtle/60'>Creating rooms is exclusive to Donators & Staff but any registered user can join existing rooms.</span>
    </Dialog.Content>
  </Dialog.Portal>
  </Dialog.Root>
}


type TitleInputProps = {
  id?: string
  title: string
  footer?: string
}

const TitleInput = ({ id, title, footer, children }: React.PropsWithChildren<TitleInputProps>) => (
  <div className="flex flex-col -mt-4">
    <label htmlFor={id} className="-mb-0.5 mt-3 text-sm text-white/50">
      {title}
    </label>
    {children}
    {footer && <span className="flex -mt-1 text-xs text-subtle">{footer}</span>}
  </div>
)


export default CreateRoomDialog
