import { useMediaStore, useMediaRemote } from '@vidstack/react'

type Props = {}

function PlayButton({}: Props) {
  const { paused } = useMediaStore()
  const remote = useMediaRemote()

  return (
    <div
      className='group pointer-events-auto flex cursor-pointer items-center justify-center hover:text-accent hover:bg-primary duration-200 h-10 w-10 rounded-md'
      onClick={() => {
        paused ? remote.play() : remote.pause()
      }}
    >
      <svg  viewBox='0 0 32 32' fill='none' aria-hidden='true' xmlns='http://www.w3.org/2000/svg' className='media-paused:hidden h-6 w-6 duration-300 block'>
        <path d='M8.66667 6.66667C8.29848 6.66667 8 6.96514 8 7.33333V24.6667C8 25.0349 8.29848 25.3333 8.66667 25.3333H12.6667C13.0349 25.3333 13.3333 25.0349 13.3333 24.6667V7.33333C13.3333 6.96514 13.0349 6.66667 12.6667 6.66667H8.66667Z' fill='currentColor' />
        <path d='M19.3333 6.66667C18.9651 6.66667 18.6667 6.96514 18.6667 7.33333V24.6667C18.6667 25.0349 18.9651 25.3333 19.3333 25.3333H23.3333C23.7015 25.3333 24 25.0349 24 24.6667V7.33333C24 6.96514 23.7015 6.66667 23.3333 6.66667H19.3333Z' fill='currentColor' />
      </svg>
      <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" className='media-paused:block h-6 w-6 duration-300 hidden'>
        <path d="M10.6667 6.6548C10.6667 6.10764 11.2894 5.79346 11.7295 6.11862L24.377 15.4634C24.7377 15.7298 24.7377 16.2692 24.3771 16.5357L11.7295 25.8813C11.2895 26.2065 10.6667 25.8923 10.6667 25.3451L10.6667 6.6548Z" fill="currentColor" />
      </svg>
    </div>
  )
}

export default PlayButton
