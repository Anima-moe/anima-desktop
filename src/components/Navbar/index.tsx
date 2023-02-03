import { motion } from 'framer-motion'

import SearchApplet from '@/components/Applets/Search/Navbar'
import NotificationApplet from '@/components/Applets/Notifications/Navbar'
import UserApplet from '@/components/Applets/User/Navbar'
import ConfigApplet from '@/components/Applets/Settings/Navbar'
import { useRouter } from 'next/router'
import Link from 'next/link'
import useNavScroll from '@/hooks/useNavScroll'


function Index() {
 const immersive = useNavScroll()

  return <motion.nav 
    className={`w-full py-3 px-8 flex flex-row select-none h-16 fixed z-[99] ${immersive ? 'bg-transparent bg-opacity-100' : 'bg-primary bg-opacity-40 backdrop-blur-sm'}`}
  >
    {/* LOGO */}
    <div className='flex w-3/12 items-center cursor-pointer'>
      <Link href='/'><img src='/anima.svg' className='w-22' /></Link>
    </div>
    {/* SEARCH BAR */}
    <div className='flex items-center justify-center focus-within:text-white w-6/12 h-full'>
        <SearchApplet />
    </div>
    {/* NAVBAR ICONS */}
    <div className='flex w-3/12 items-center justify-end'>
        <NotificationApplet />
        <ConfigApplet />
        <UserApplet />
    </div>
  </motion.nav>
}

export default Index