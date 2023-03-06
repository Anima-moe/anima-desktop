import { useAtom } from 'jotai'
import { useRouter } from 'next/router'

import { userPreferedPlayerMode } from '@/stores/atoms'
import { MediaToggleButton } from '@vidstack/react'
import { useMediaRemote } from '@vidstack/react'

type Props = {}

function ExpandButton({}: Props) {
  const [playerMode, setPlayerMode] = useAtom(userPreferedPlayerMode)
  const remote = useMediaRemote()
  const router = useRouter()

  return (
    <MediaToggleButton
      className='group pointer-events-auto ml-auto flex cursor-pointer items-center justify-center px-2 py-2 hover:bg-primary rounded-md duration-200'
      onClick={() => {
        setPlayerMode(playerMode === 'normal' ? 'expanded' : 'normal')
      }}
    >
      {/* EXPANDED */}
      <svg viewBox='0 0 32 32' fill='none' aria-hidden='true' xmlns='http://www.w3.org/2000/svg' className={`${playerMode === 'normal' ? 'hidden' : 'block'} h-6 w-6 duration-200`} >
        <path d="M5.33333 7.33334C5.33333 6.96515 5.63181 6.66667 5.99999 6.66667H26C26.3682 6.66667 26.6667 6.96515 26.6667 7.33334V24.6667C26.6667 25.0349 26.3682 25.3333 26 25.3333H5.99999C5.63181 25.3333 5.33333 25.0349 5.33333 24.6667V7.33334ZM7.99999 10C7.99999 9.63182 8.29847 9.33334 8.66666 9.33334H19.8667C19.9403 9.33334 20 9.39303 20 9.46667V22.5333C20 22.607 19.9403 22.6667 19.8667 22.6667H8.66666C8.29847 22.6667 7.99999 22.3682 7.99999 22V10Z" fill="currentColor" />
      </svg>
      {/* NORMAL */}
      <svg  viewBox="0 0 32 32" fill="none" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" className={`${playerMode !== 'normal' ? 'hidden' : 'block'} h-6 w-6 duration-200`}>
        <path d="M5.33334 7.33334C5.33334 6.96515 5.63181 6.66667 6 6.66667H26C26.3682 6.66667 26.6667 6.96515 26.6667 7.33334V24.6667C26.6667 25.0349 26.3682 25.3333 26 25.3333H6C5.63181 25.3333 5.33334 25.0349 5.33334 24.6667V7.33334ZM8 10C8 9.63182 8.29848 9.33334 8.66667 9.33334H17.2C17.2736 9.33334 17.3333 9.39303 17.3333 9.46667V22.5333C17.3333 22.607 17.2736 22.6667 17.2 22.6667H8.66667C8.29848 22.6667 8 22.3682 8 22V10ZM20 22.5333C20 22.607 20.0597 22.6667 20.1333 22.6667H23.3333C23.7015 22.6667 24 22.3682 24 22V10C24 9.63182 23.7015 9.33334 23.3333 9.33334H20.1333C20.0597 9.33334 20 9.39303 20 9.46667V22.5333Z" fill="currentColor" />
      </svg>
    </MediaToggleButton>
  )
}

export default ExpandButton
