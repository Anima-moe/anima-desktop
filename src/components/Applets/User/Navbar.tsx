import { Gear, SignOut, User } from 'phosphor-react'

import NavIcon from '@/components/Navbar/NavbarIcon'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'

function Navbar() {
  const handleLogout = () => {}

  const menuItems = [{ name: 'Sign out', Icon: SignOut, click: handleLogout }]

  return (
    <div className=''>
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button 
            className='h-full aspect-square bg-secondary border border-tertiary rounded-md flex items-center justify-center p-2 text-subtle hover:text-white hover:bg-black duration-300 hover:border-tertiary cursor-pointer active:bg-accent active:border-accent active:text-primary bg-opacity-60 backdrop-blur-sm border-opacity-50'
            // onClick={()=>{
            // }}
        >
          <User size={22}/>
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content className="bg-secondary border border-tertiary min-w-[13rem] px-1 py-2 rounded-md mr-8" sideOffset={5}>
          <DropdownMenu.Item className="rounded-md hover:bg-accent bg-secondary duration-200 transition-all cursor-pointer px-2 py-2 hover:text-primary my-1">
            <span className='flex '><User size={22} className='mr-3'/> My profile</span>
          </DropdownMenu.Item>
          <DropdownMenu.Item className="rounded-md hover:bg-accent bg-secondary duration-200 transition-all cursor-pointer px-2 py-2 hover:text-primary  my-1">
            <span className='flex '><Gear size={22} className='mr-3'/> Settings</span>
          </DropdownMenu.Item>
          <DropdownMenu.Separator className="w-full border border-tertiary  my-1" />
          <DropdownMenu.Item className="rounded-md hover:bg-red-400 bg-secondary duration-200 transition-all cursor-pointer px-2 py-2 hover:text-primary mt-1">
            <span className='flex '><SignOut size={22} className='mr-3'/> Sign out</span>
           </DropdownMenu.Item>
          <DropdownMenu.Arrow className="DropdownMenuArrow" />
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>


    </div>
  )
}

export default Navbar
