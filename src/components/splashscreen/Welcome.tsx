import { motion } from 'framer-motion'

type Props = {}

function Welcome({}: Props) {
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
      className="relative flex h-screen w-screen overflow-hidden rounded-xl bg-primary"
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
        className="h-full w-full"
      >
        <video
          autoPlay
          muted
          src="/i/splash.mp4"
          className="h-full w-full overflow-hidden rounded-md object-fill"
          loop
        />
      </motion.div>
      <div className="absolute top-0 left-0 h-full w-full bg-primary opacity-70" />
      <div className="animation-flash absolute top-1/2 left-1/2 flex -translate-y-1/2 -translate-x-1/2 flex-col items-center justify-center">
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
          className="mix w-64"
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
