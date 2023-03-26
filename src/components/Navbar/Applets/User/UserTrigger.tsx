import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'

import clsx from 'clsx'
import { useAtom } from 'jotai'
import Link from 'next/link'
import { SignIn, SignOut, User } from 'phosphor-react'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/General/DropdownMenu'
import { User as UserService } from '@/services/anima/user'
import { createSplashScreen } from '@/services/tauri/windows'
import { userToken } from '@/stores/atoms'
import { DropdownMenuArrow } from '@radix-ui/react-dropdown-menu'



function Navbar() {
  const [storedToken, setStoredToken] = useAtom(userToken)
  const {data: user, isLoading: userIsLoading, error: userError} = useQuery('/api/user/me', UserService.me, {
    refetchOnWindowFocus: false
  })

  const { t } = useTranslation()

  const handleLogout = async () => {
    await setStoredToken('')
    await createSplashScreen()
  }

  const menuItems = [
    { name: t('nav.user.action.profile'), Icon: User, href: '/user/me', requireAuth: true },
    {
      name: t('nav.user.action.signout'),
      Icon: SignOut,
      click: handleLogout,
      class: 'hover:bg-red-400',
      requireAuth: true,
    },
    {
      name: t('nav.user.action.signin'),
      Icon: SignIn,
      click: handleLogout,
      requireAuth: false,
    },
  ]

  return (
    <div className="z-50 h-full">
      <DropdownMenu>
        {user ? (
          <DropdownMenuTrigger asChild>
            <div className='flex items-center h-full gap-2 px-2 py-1 duration-200 rounded-md cursor-pointer hover:bg-primary group'>
              <div 
                className='relative flex items-center px-4 text-lg font-semibold rounded-md h-11 bg-secondary overflow-hiden'
                style={{
                  color: user?.profile?.color
                }}
              >
                <div 
                  className='absolute inset-0 w-full h-full rounded-md opacity-10' 
                  style={{
                    backgroundColor: user?.profile?.color,
                    textShadow: `0 0 32px ${user?.profile?.color}`
                  }} 
                />
                <span className='z-[1]'>{user?.username}</span>
              </div>
              <div
                className="items-center justify-center bg-center bg-cover rounded-md w-11 h-11 bg-secondary"
                style={{
                  backgroundImage: `url('${
                    user?.profile?.avatar || 'https://i.imgur.com/CBdQGA3.png'
                  }')`,
                }}
              />
            </div>
          </DropdownMenuTrigger>
        ) : (
          <DropdownMenuTrigger asChild>
            <button className="flex items-center justify-center h-12 p-2 duration-300 border-opacity-50 rounded-md cursor-pointer aspect-square bg-opacity-60 backdrop-blur-sm hover:border-tertiary hover:bg-black hover:text-white active:border-accent active:bg-accent active:text-primary">
              <User size={22} />
            </button>
          </DropdownMenuTrigger>
        )}

        <DropdownMenuContent
          className="z-[50] min-w-[13rem] rounded-md border border-tertiary bg-secondary px-2 py-2"
          sideOffset={0}
          align="end"
        >
          {menuItems.map((item, i, arr) => {
            if (item.requireAuth && !user) return null

            if (!item.requireAuth && !user) return <Link href={item.href || '#'} key={`user.navbar.${i}`}>
              <DropdownMenuItem
                className={clsx(
                  'cursor-pointer rounded-md bg-secondary px-2 py-2 transition-all duration-200 hover:bg-accent hover:text-primary',
                  item.class
                )}
                onClick={item.click}
              >
                <span className="flex">
                  <item.Icon size={22} className="mr-3" />
                  {item.name}
                </span>
              </DropdownMenuItem>
            </Link>

            if (item.requireAuth && user) {
              return (
                <Link href={item.href || '#'} key={`user.navbar.${i}`}>
                  <DropdownMenuItem
                    className={clsx(
                      'cursor-pointer rounded-md bg-secondary px-2 py-2 transition-all duration-200 hover:bg-accent hover:text-primary',
                      item.class
                    )}
                    onClick={item.click}
                  >
                    <span className="flex">
                      <item.Icon size={22} className="mr-3" />
                      {item.name}
                    </span>
                  </DropdownMenuItem>
                </Link>
              )
            }

          })}
        <DropdownMenuArrow  className='fill-secondary stroke-tertiary'/>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export default Navbar
