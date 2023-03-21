import clsx from 'clsx'
import { useAtom } from 'jotai'

import { userPreferedPlayerMode } from '@/stores/atoms'


type Props = {
  children: React.ReactNode | React.ReactNode[] | JSX.Element | JSX.Element[]
}

function Media({ children }: Props) {
  const [playerMode] = useAtom(userPreferedPlayerMode)
  
  const playerModeClasses = clsx({
    'flex bg-primary w-screen h-[calc(100vh-32px)] overflow-y-scroll max-h-[100vh]': true,
    'absolute top-0 h-screen': playerMode === 'expanded',
    'pt-16': playerMode === 'normal',
  })
  
  return (
    <main className={playerModeClasses} id='content'>
      {children}
    </main>
  )
}

export default Media
