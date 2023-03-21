import { useTranslation } from 'react-i18next'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/router'

import NotificationApplet from '@/components/Navbar/Applets/Notifications/NotificataionsTrigger'
import SearchApplet from '@/components/Navbar/Applets/Search/SearchTrigger'
import UserApplet from '@/components/Navbar/Applets/User/UserTrigger'
import useNavScroll from '@/hooks/useNavScroll'

import SettingsTrigger from './Applets/Settings/SettingsTrigger'

const navLinks = [
  {
    name: 'nav.link.animes',
    href: '/',
    routes: ['/', '/episode', '/anime', '/w2g', '/animesearch']
  },
  {
    name: 'nav.link.manga',
    href: '/manga',
    routes: ['/manga', '/chapter', '/volume', '/scanlate']
  },
  {
    name: 'nav.link.donate',
    href: '/donate',
    routes: ['/donate']
  },
  {
    name: 'nav.link.about',
    href: '/about',
    routes: ['/about']
  }
]


function Index() {
  const router = useRouter()
  const immersive = useNavScroll()
  const { t } = useTranslation()

  const matchRoute = (routes: string[]) => {
    const currentRoute = router.asPath
    if (currentRoute === '/' && routes.includes('/')) return true
    const matchedRoute = routes.includes(currentRoute)
    if (matchedRoute) return true
  }

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
      <div className="flex items-center justify-center w-6/12 h-full gap-3 focus-within:text-white z-[1]">
        {navLinks.map( item => {
          return <Link href={item.href} key={`nav.link.${item.href}`}> 
            <div className={`rounded ${matchRoute(item.routes) ? 'bg-primary text:accent' : 'bg-transparent'} px-3 py-1.5 hover:bg-accent hover:text-primary duration-300`}>
              {t(item.name)}
            </div>
          </Link>
        })}
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
