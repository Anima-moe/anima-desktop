import { Bell } from 'phosphor-react'

import NavIcon from '@/components/Navbar/NavbarIcon'

function NavNotifications() {
  // TODO: Fetch notifications
  return (
    <>
      <NavIcon 
      title="No notifications"
      Icon={<Bell size={24} />}
      onClick={() => {}} />
    </>
  )
}

export default NavNotifications
