import clsx from 'clsx'
import { useAtom } from 'jotai'

import { userPreferedPlayerMode } from '@/stores/atoms'


type Props = {
  children: React.ReactNode | React.ReactNode[] | JSX.Element | JSX.Element[]
}

function Media({ children }: Props) {
  const [playerMode, setPlayerMode] = useAtom(userPreferedPlayerMode)
  
  const playerModeClasses = clsx({
    'flex h-screen w-screen overflow-auto': true,
    'pt-0': playerMode === 'expanded',
    'pt-16': playerMode === 'normal',
  })
  
  return (
    <main className={playerModeClasses} id='content'>
      {children}
    </main>
  )
}

export default Media
