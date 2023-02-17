import { Fragment } from 'react'
import { useTranslation } from 'react-i18next'

import clsx from 'clsx'
import { useRouter } from 'next/router'
import { Gear, SignOut, User } from 'phosphor-react'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/General/DropdownMenu'

function Navbar() {
  const router = useRouter()
  const { t } = useTranslation()

  const handleProfile = () => {
    router.push(`/user/${1}`)
  }
  const handleSettings = () => {
    router.push(`/user/${1}/edit`)
  }
  const handleLogout = () => {}

  const menuItems = [
    { name: t('user_menu_profile'), Icon: User, click: handleProfile },
    { name: t('user_menu_settings'), Icon: Gear, click: handleSettings },
    { name: t('user_menu_signout'), Icon: SignOut, click: handleLogout, class: 'hover:bg-red-400' },
  ]

  return (
    <div className="">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex aspect-square h-full cursor-pointer items-center justify-center rounded-md border border-tertiary border-opacity-50 bg-secondary bg-opacity-60 p-2 text-subtle backdrop-blur-sm duration-300 hover:border-tertiary hover:bg-black hover:text-white active:border-accent active:bg-accent active:text-primary">
            <User size={22} />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="z-50 min-w-[13rem] rounded-md border border-tertiary bg-secondary px-2 py-2"
          sideOffset={16}
          align="end"
        >
          {menuItems.map((item, i, arr) => (
            <Fragment key={`user.navbar.${i}`}>
              {i === arr.length - 1 && (
                <DropdownMenuSeparator className="my-2 w-full border border-tertiary" />
              )}
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
            </Fragment>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export default Navbar
