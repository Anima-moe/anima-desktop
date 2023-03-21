import { motion } from 'framer-motion'
import Link from 'next/link'

import NotificationApplet from '@/components/Navbar/Applets/Notifications/NotificataionsTrigger'
import SearchApplet from '@/components/Navbar/Applets/Search/SearchTrigger'
import UserApplet from '@/components/Navbar/Applets/User/UserTrigger'
import useNavScroll from '@/hooks/useNavScroll'

import SettingsTrigger from './Applets/Settings/SettingsTrigger'

function Index() {
  const immersive = useNavScroll()

  return (
    <motion.nav
      className='fixed z-50 flex flex-row w-full h-20 max-h-[5rem] px-8 py-3 select-none'
    >
      <div className={`absolute top-0 left-0 w-full h-full bg-gradient-to-b transition-all duration-300 z-[0] from-secondary pointer-events-none ${
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
      <div className="flex items-center justify-center w-6/12 h-full focus-within:text-white">
        {/*  */}
      </div>
      {/* NAVBAR ICONS */}
      <div className="flex items-center justify-end w-3/12 gap-2">
        <SearchApplet />
        <NotificationApplet />
        <SettingsTrigger />
        <UserApplet />
      </div>
    </motion.nav>
  )
}

export default Index
