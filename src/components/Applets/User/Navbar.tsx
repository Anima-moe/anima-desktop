import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'

import clsx from 'clsx'
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
import { DropdownMenuArrow } from '@radix-ui/react-dropdown-menu'

function Navbar() {
  const {data: user, isLoading: userIsLoading, error: userError} = useQuery('/api/user/me', UserService.me, {
    refetchOnWindowFocus: false
  })

  const { t } = useTranslation()

  const handleLogout = async () => {
    const { setConfigValue } = await import('@/services/tauri/configValue')
    const { relaunch } = await import('@tauri-apps/api/process')
    await setConfigValue('token', '')
    await relaunch()
  }

  const menuItems = [
    { name: t('user_menu_profile'), Icon: User, href: '/user/me', requireAuth: true },
    {
      name: t('user_menu_signout'),
      Icon: SignOut,
      click: handleLogout,
      class: 'hover:bg-red-400',
      requireAuth: true,
    },
    {
      name: t('user_menu_login'),
      Icon: SignIn,
      click: handleLogout,
      requireAuth: false,
    },
  ]

  return (
    <div className="z-50">
      <DropdownMenu>
        {user ? (
          <DropdownMenuTrigger asChild>
            <button
              className="h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-secondary bg-cover bg-center"
              style={{
                backgroundImage: `url('${
                  user?.profile?.avatar || 'https://i.imgur.com/CBdQGA3.png'
                }')`,
              }}
            />
          </DropdownMenuTrigger>
        ) : (
          <DropdownMenuTrigger asChild>
            <button className="flex aspect-square h-12 cursor-pointer items-center justify-center rounded-md  border-opacity-50  bg-opacity-60 p-2 backdrop-blur-sm duration-300 hover:border-tertiary hover:bg-black hover:text-white active:border-accent active:bg-accent active:text-primary">
              <User size={22} />
            </button>
          </DropdownMenuTrigger>
        )}

        <DropdownMenuContent
          className="z-[50] min-w-[13rem] rounded-md border border-tertiary bg-secondary px-2 py-2"
          sideOffset={16}
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
