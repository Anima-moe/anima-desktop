import { motion } from 'framer-motion'
import Link from 'next/link'

import NotificationApplet from '@/components/Applets/Notifications/Navbar'
import SearchApplet from '@/components/Applets/Search/Navbar'
import UserApplet from '@/components/Applets/User/Navbar'
import useNavScroll from '@/hooks/useNavScroll'

function Index() {
  const immersive = useNavScroll()

  return (
    <motion.nav
      className='fixed z-[99] flex h-16 w-full select-none flex-row py-3 px-8'
    >
      <div className={`absolute top-0 left-0 w-full h-full bg-gradient-to-b transition-all duration-300 z-[0] from-primary ${
        immersive
          ? 'opacity-100' 
          : 'opacity-0'
      }`} />
      {/* LOGO */}
      <div className="flex w-3/12 items-center z-[1]">
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
        <UserApplet />
      </div>
    </motion.nav>
  )
}

export default Index
