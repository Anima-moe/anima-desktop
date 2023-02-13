import { SignOut, User } from 'phosphor-react'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/General/DropdownMenu'
import NavIcon from '@/components/Navbar/NavbarIcon'

function Navbar() {
  const handleLogout = () => {}

  const menuItems = [{ name: 'Sign out', Icon: SignOut, click: handleLogout }]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <NavIcon title="No notifications" Icon={<User size={22} />} />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="data-[side=top]:animate-slideDownAndFade data-[side=right]:animate-slideLeftAndFade data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade min-w-[220px] rounded-md bg-secondary p-[5px] shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)] will-change-[opacity,transform]"
        sideOffset={5}
      >
        {menuItems.map((item) => (
          <DropdownMenuItem
            key={item.name}
            className="relative flex h-[25px] select-none items-center rounded-[3px] px-[5px] pl-[25px] text-[13px] leading-none outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-black data-[disabled]:text-gray-600 data-[highlighted]:text-white"
            onClick={item.click}
          >
            <div className="left-0 inline-flex w-6 items-center justify-center">
              <item.Icon />
            </div>
            {item.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default Navbar
