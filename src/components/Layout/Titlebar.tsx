import { useEffect, useRef, useState } from 'react'

import clsx from 'clsx'
import { useAtom } from 'jotai'
import { Minus, X } from 'phosphor-react'

import useOnClickOutside from '@/hooks/useOnClickOutside'
import { userPreferedPlayerMode } from '@/stores/atoms'
import { FullscreenIcon } from '@vidstack/react'

interface ITitlebarProps {
}

const Titlebar: React.FunctionComponent<ITitlebarProps> = (props) => {
  const [playerMode] = useAtom(userPreferedPlayerMode)
  const [slideTitlebar, setSlideTitlebar] = useState(false)
  const titleBar = useRef<HTMLDivElement>()
  const classes = clsx({
    'flex w-full h-10 bg-secondary gap-2 z-[999] inset-0 rounded-t-md relative justify-between items-center pointer-events-none px-4 transition-all duration-200': true,
    '-translate-y-[calc(100%-8px)] opacity-20': playerMode === 'expanded',
    'translate-y-0 opacity-[1]': slideTitlebar && playerMode === 'expanded' ||  playerMode === 'normal',
  })
  
  const handleClickOutside = () => {
    setSlideTitlebar(false)    
  }

  useOnClickOutside(titleBar, handleClickOutside)
  useEffect(()=>{
    document.body.style.backgroundColor = 'transparent'
  }, [])
  return <div 
    className={classes}
    onMouseEnter={()=>{
      setSlideTitlebar(true)
    }}
    ref={titleBar}
  >
    <div 
      className="flex items-center w-full h-full gap-4 pointer-events-auto"
      onMouseDown={(e) => {
        //@ts-expect-error - this is tauri exclusive shit
        window.__TAURI_INVOKE__('tauri', {
          __tauriModule: 'Window',
          message: {
            cmd: 'manage',
            data: {
              cmd: {
                type: e.detail === 2 ? '__toggleMaximize' : 'startDragging',
              },
            },
          },
        })
      }}
    >
      <img src="/i/a.svg" />
      <span className="px-2 py-1 text-xs rounded-md cursor-default bg-tertiary text-accent">Beta</span>
    </div>
    <div className='flex items-center gap-4'>
      <div 
        className="duration-300 cursor-pointer pointer-events-auto text-subtle hover:text-accent"
        onMouseUp={()=>{
          import('@tauri-apps/api/window')
          .then( async mod => {
            mod.appWindow.minimize()
          })
        }}
      >
        <Minus className='pointer-events-none' size={20} />
      </div>
      <div 
        className="duration-300 cursor-pointer pointer-events-auto text-subtle hover:text-accent"
        onMouseUp={()=>{
          import('@tauri-apps/api/window')
          .then( async mod => {
            const fullscreen = await mod.appWindow.isFullscreen()
            if (fullscreen) {
              return
            }

            mod.appWindow.toggleMaximize()
          })
        }}
      >
        <FullscreenIcon className='pointer-events-none' size={20} />
      </div>
      <div 
        className="duration-300 cursor-pointer pointer-events-auto text-subtle hover:text-accent"
        onMouseUp={()=>{
          import('@tauri-apps/api/window')
          .then( mod => {
            mod.appWindow.close()
          })
        }}
      >
        <X className='pointer-events-none' size={20} />
      </div>
    </div>
  </div>
}

export default Titlebar
