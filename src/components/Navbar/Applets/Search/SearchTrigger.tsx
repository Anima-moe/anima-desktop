import { useRef, useState } from 'react'


import { motion } from 'framer-motion'
import { t } from 'i18next'
import { useAtom } from 'jotai'
import { MagnifyingGlass, X } from 'phosphor-react'
import resolveConfig from 'tailwindcss/resolveConfig'
import { debounce } from 'ts-debounce'

import tailwindConfig from '@/../tailwind.config.js'
import SearchPortal from '@/components/Navbar/Applets/Search/SearchPortal'
import { displaySearchPortal } from '@/stores/atoms'
import * as Portal from '@radix-ui/react-portal'

import NavbarIcon from '../../NavbarIcon'
const twConfig = resolveConfig(tailwindConfig)


type Props = {}

function Navbar({}: Props) {
  const [query, setQuery] = useState<string>('')
  const [focused, setFocused] = useAtom(displaySearchPortal)
  const inputRef = useRef<HTMLInputElement>(null)

  const debouncedSetQuery = debounce(setQuery, 300)

  return (
    <>
     <NavbarIcon 
      Icon={<MagnifyingGlass size={24} />}
      onClick={()=>{
        setFocused(!focused)
      }}
      title={t('navbar.search')}
     />
      {focused && (
        <Portal.Root>
          <SearchPortal />
        </Portal.Root>
      )}
    </>
  )
}

export default Navbar
