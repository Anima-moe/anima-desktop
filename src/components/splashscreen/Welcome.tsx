import { useEffect, useState } from 'react'

import { motion } from 'framer-motion'

type Props = {}
const splashes = [2, 3, 4]

function Welcome({}: Props) {
  const [splash, setSplash] = useState<number>(1)

  const splashBackground = '/i/splash_' + splash + '.mp4'

  useEffect(()=>{
    setSplash(splashes[Math.floor(Math.random() * splashes.length)])
    document.body.style.background = 'transparent'
  }, [])
  
  return (
    <motion.main
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      transition={{
        duration: 0.2,
        type: 'spring',
        stiffness: 500,
        damping: 60,
        mass: 1,
      }}
      exit={{
        opacity: 1,
      }}
      key={'welcome'}
      className="relative flex w-screen h-screen overflow-hidden rounded-xl bg-primary"
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
      <motion.div
        initial={{
          opacity: 0,
          scale: 2,
        }}
        animate={{
          opacity: 1,
          scale: 1,
        }}
        exit={{
          scale: 2,
          opacity: 0,
        }}
        transition={{
          duration: 0.3,
          delay: 0.3,
          type: 'spring',
          stiffness: 500,
          damping: 60,
          mass: 1,
        }}
        className="w-full h-full"
      >
        <video
          autoPlay
          muted
          src={splashBackground}
          className="object-fill w-full h-full overflow-hidden rounded-md"
          loop
        />
      </motion.div>
      <div className="absolute top-0 left-0 w-full h-full bg-primary opacity-70" />
      <div className="absolute flex flex-col items-center justify-center -translate-x-1/2 -translate-y-1/2 animation-flash top-1/2 left-1/2">
        <motion.img
          initial={{
            opacity: 0,
            y: -50,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.6,
            delay: 0.6,
            type: 'spring',
            stiffness: 500,
            damping: 60,
            mass: 1,
          }}
          exit={{
            opacity: 0,
            y: -50,
          }}
          src="/i/anima.svg"
          className="w-64 mix"
        />
        <motion.span
          className="mt-4"
          initial={{
            opacity: 0,
            y: 50,
          }}
          animate={{
            opacity: 0.8,
            y: 0,
          }}
          transition={{
            duration: 0.6,
            delay: 0.6,
            type: 'spring',
            stiffness: 500,
            damping: 60,
            mass: 1,
          }}
          exit={{
            opacity: 0,
            y: 50,
          }}
        >
          あーにま
        </motion.span>
      </div>
    </motion.main>
  )
}

export default Welcome
