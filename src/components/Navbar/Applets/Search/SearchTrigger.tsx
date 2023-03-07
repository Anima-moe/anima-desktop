import { useRef, useState } from 'react'
import { Portal } from 'react-portal'

import { motion } from 'framer-motion'
import { t } from 'i18next'
import { useAtom } from 'jotai'
import { MagnifyingGlass, X } from 'phosphor-react'
import resolveConfig from 'tailwindcss/resolveConfig'
import { debounce } from 'ts-debounce'

import tailwindConfig from '@/../tailwind.config.js'
import SearchPortal from '@/components/Navbar/Applets/Search/SearchPortal'
import { displaySearchPortal } from '@/stores/atoms'
const twConfig = resolveConfig(tailwindConfig)

const typebarVariants = {
  initial: {
    y: 0,
    padding: '0px 1rem 0px 3rem',
    width: '20%',
    fontSize: '1em',
    border: '1px',
    borderStyle: 'solid solid solid solid',
    borderColor: twConfig.theme.colors['tertiary'] as string,
    zIndex: 'unset',
    transition: {
      duration: 0.2,
      type: 'spring',
      stiffness: 500,
      damping: 60,
      mass: 1,
    },
  },
  animate: {
    width: '45%',
    borderBottom: 'none none none #f45000',
    padding: '0 1rem 0 1rem',
    y: '5rem',
    height: '4rem',
    fontSize: '1.3em',
    border: '1px solid',
    borderStyle: 'none none solid none',
    borderRadius: 0,
    zIndex: 2,
    transition: {
      duration: 0.2,
      type: 'spring',
      stiffness: 500,
      damping: 60,
      mass: 1,
    },
  },
}

const searchIconVariants = {
  initial: {
    y: 0,
    left: '1rem',
    x: 0,
    opacity: 1,
  },
  animate: {
    x: '-100%',
    left: '0',
    opacity: 0,
  },
}

const clearIconVariants = {
  initial: {
    right: '0m',
    opacity: 0,
    transition: {
      delay: 0,
      duration: 0.1,
      type: 'spring',
      stiffness: 500,
      damping: 60,
      mass: 1,
      ease: 'easeInOut',
    },
  },
  animate: {
    right: '1em',
    opacity: 1,
    transition: {
      delay: 0.3,
      duration: 0.1,
      type: 'spring',
      stiffness: 500,
      damping: 60,
      mass: 1,
      ease: 'easeInOut',
    },
  },
}

type Props = {}

function Navbar({}: Props) {
  const [query, setQuery] = useState<string>('')
  const [focused, setFocused] = useAtom(displaySearchPortal)
  const inputRef = useRef<HTMLInputElement>(null)

  const debouncedSetQuery = debounce(setQuery, 300)

  return (
    <>
      <motion.div
        initial="initial"
        animate={focused ? 'animate' : 'initial'}
        variants={typebarVariants}
        onFocus={() => {
          setFocused(true)
        }}
        onKeyUp={(e) => {
          if (e.key === 'Escape') {
            if (!inputRef.current) {
              return
            }
            setQuery('')
            inputRef.current.blur()
            setFocused(false)
            inputRef.current.value = ''
          }
        }}
        className={`absolute flex flex-row items-center rounded-md ${
          focused ? 'bg-transparent' : '!border-0 bg-tertiary/40 backdrop-blur-md'
        }`}
      >
        <motion.div
          initial="initial"
          animate={focused ? 'animate' : 'initial'}
          variants={searchIconVariants}
          className="absolute text-white/50"
        >
          <MagnifyingGlass size={22} />
        </motion.div>
        <motion.div
          className="absolute cursor-pointer text-subtle"
          variants={clearIconVariants}
          onClick={() => {
            if (!inputRef?.current) return
            inputRef.current.value = ''
            setQuery('')
            inputRef.current.blur()
            setFocused(false)
          }}
        >
          <X size={32} />
        </motion.div>
        <input
          className="w-full bg-transparent py-2 text-subtle outline-none placeholder:text-white/50 focus:font-medium focus:text-white focus:ring-0 focus:ring-offset-0"
          placeholder={focused ? t('search_prompt') : t('search_placeholder')}
          onChange={(e) => {
            debouncedSetQuery(e.target.value)
          }}
          ref={inputRef}
        />
      </motion.div>
      {focused && (
        <Portal>
          <SearchPortal query={query} />
        </Portal>
      )}
    </>
  )
}

export default Navbar
