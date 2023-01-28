import { motion } from 'framer-motion'
import { MagnifyingGlass, Backspace } from 'phosphor-react'
import { useRef, useState } from 'react'

import SearchPortal from '@/components/Applets/Search/SearchPortal'
import { Portal } from 'react-portal'
import resolveConfig from 'tailwindcss/resolveConfig'
import tailwindConfig from '@/../tailwind.config.js'
const twConfig = resolveConfig(tailwindConfig)

const typebarVariants = {
  initial: {
    y: 0,
    padding: '0px 1rem 0px 3rem',
    width: '20%',
    fontSize: '1em',
    border: `1px`,
    borderStyle: 'solid solid solid solid',
    borderColor: twConfig.theme.colors['tertiary'],
    zIndex: 'unset',
    transition: {
      duration: .3,
      type: 'spring',
      stiffness: 500,
      damping: 60,
      mass: 1,
      ease: 'easeInOut'
    }
  },
  animate: {
    width: '45%',
    borderBottom: 'none none none #f45000',
    padding: '0 1rem 0 1rem',
    y: '6rem',
    height: '4rem',
    fontSize: '1.3em',
    border: '1px solid',
    borderStyle: 'none none solid none',
    borderRadius: 0,
    zIndex: 2,
    transition: {
      duration: .3,
      type: 'spring',
      stiffness: 500,
      damping: 60,
      mass: 1,
      ease: 'easeInOut'
    }
  }
}

const searchIconVariants = {
  initial: {
    y: 0,
    left: '1rem',
    x: 0,
    opacity: 1
  },
  animate: {
    x: '-100%',
    left: '0',
    opacity: 0
  }
}

const clearIconVariants = {
  initial: {
    right: '-2em',
    opacity: 0,
    transition: {
      delay: .3,
      duration: .1,
      type: 'spring',
      stiffness: 500,
      damping: 60,
      mass: 1,
      ease: 'easeInOut'
    }
  },
  animate: {
    right: '1em',
    opacity: 1,
    transition: {
      delay: .3,
      duration: .1,
      type: 'spring',
      stiffness: 500,
      damping: 60,
      mass: 1,
      ease: 'easeInOut'
    }
  }
}

type Props = {}

function Navbar({}: Props) {
  const [query, setQuery] = useState<string>("")
  const [focused, setFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  return <>
  <motion.div 
    initial='initial'
    animate={focused ? 'animate' : 'initial'} 
    variants={typebarVariants}
    onFocus={()=>{setFocused(true)}} 
    onBlur={()=>{
      if (query && query.length > 0) return
      setFocused(false)
    }} 
    onKeyUp={(e)=>{
      if (e.key === 'Escape') {
        if (!inputRef.current) { return }
        setQuery('')
        inputRef.current.blur()
        setFocused(false)
        inputRef.current.value = ''
      }
    }}
    className={`absolute flex flex-row items-center rounded-md ${focused ? 'bg-transparent' : 'bg-secondary bg-opacity-40 !border-0 backdrop-blur-md'}`}
  >
    <motion.div 
      initial='initial'
      animate={focused ? 'animate' : 'initial'} 
      variants={searchIconVariants}
      className='absolute text-subtle'
    >
      <MagnifyingGlass size={22} />
    </motion.div>
    <motion.div
      className='absolute text-subtle cursor-pointer'
      variants={clearIconVariants}
      onClick={()=>{
        if (!inputRef?.current) return
        inputRef.current.value = ''
        setQuery('')
        inputRef.current.focus()
      }}
    >
      <Backspace size={32} />
    </motion.div>
    <input 
      className='py-2 bg-transparent text-subtle placeholder:text-subtle w-full focus:text-white focus:ring-0 focus:ring-offset-0 outline-none focus:font-medium' 
      placeholder={focused ? 'Search for anime titles' : 'Search'} 
      onChange={(e)=>{
        setQuery(e.target.value)
      }} 
      ref={inputRef}
    />
  </motion.div>
  { focused && (
    <Portal>
      <SearchPortal query={query}/>
    </Portal>
  )}
</>
}

export default Navbar