import { motion } from 'framer-motion'
import Link from 'next/link'

import NotificationApplet from '@/components/Applets/Notifications/Navbar'
import SearchApplet from '@/components/Applets/Search/Navbar'
import ConfigApplet from '@/components/Applets/Settings/Navbar'
import UserApplet from '@/components/Applets/User/Navbar'
import useNavScroll from '@/hooks/useNavScroll'

function Index() {
  const immersive = useNavScroll()

  return (
    <motion.nav
      className={`fixed z-[99] flex h-16 w-full select-none flex-row py-3 px-8  transition-all duration-300 ${
        immersive
          ? 'bg-primary bg-opacity-80 backdrop-blur-sm'
          : 'bg-opacity-100 backdrop-blur-none'
      }`}
    >
      {/* LOGO */}
      <div className="flex w-3/12 items-center">
        <Link href="/">
          <div className="cursor-pointer">
            <img src="/i/anima.svg" className="w-22" />
          </div>
        </Link>
      </div>
      {/* SEARCH BAR */}
      <div className="flex h-full w-6/12 items-center justify-center focus-within:text-white">
        <SearchApplet />
      </div>
      {/* NAVBAR ICONS */}
      <div className="flex w-3/12 items-center justify-end gap-3">
        <NotificationApplet />
        <ConfigApplet />
        <UserApplet />
      </div>
    </motion.nav>
  )
}

export default Index
