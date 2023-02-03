import { motion } from 'framer-motion'

type Props = {}

function Welcome({}: Props) {
  return <motion.main
    initial={{
      opacity: 0,
    }}
    animate={{
      opacity: 1,
    }}
    transition={{
      duration: .2,
      type: 'spring',
      stiffness: 500,
      damping: 60,
      mass: 1,
    }}
    exit={{
      opacity: 1,
    }}
    key={'welcome'}
    className="bg-primary rounded-xl flex h-screen w-screen overflow-hidden relative"
    onMouseDown={(e)=>{
      //@ts-expect-error - this is tauri exclusive shit
      window.__TAURI_INVOKE__('tauri', {
        __tauriModule: 'Window',
        message: {
          cmd: 'manage',
          data: {
            cmd: {
              type: e.detail === 2 ? '__toggleMaximize' : 'startDragging'
            }
          }
        }
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
        opacity: 0
      }}
      transition={{
        duration: .3,
        delay: .3,
        type: 'spring',
        stiffness: 500,
        damping: 60,
        mass: 1,
      }}
      className="w-full h-full"
    >
      <video autoPlay muted src='/splash.mp4' className="w-full h-full object-fill rounded-md overflow-hidden" loop/>
    </motion.div>
    <div className="w-full h-full absolute top-0 left-0 opacity-70 bg-primary"/>
    <div className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 flex items-center flex-col justify-center animation-flash">
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
          duration: .6,
          delay: .6,
          type: 'spring',
          stiffness: 500,
          damping: 60,
          mass: 1,
        }}
        exit={{
          opacity: 0,
          y: -50,
        }}
        src="/anima.svg" 
        className="w-64 mix" 
      />
      <motion.span 
        className="mt-4"
        initial={{
          opacity: 0,
          y: 50,
        }}
        animate={{
          opacity: .8,
          y: 0,
        }}
        transition={{
          duration: .6,
          delay: .6,
          type: 'spring',
          stiffness: 500,
          damping: 60,
          mass: 1,
        }}
        exit={{
          opacity: 0,
          y: 50,
        }}
      >あーにま</motion.span>
    </div>
  </motion.main>
}

export default Welcome