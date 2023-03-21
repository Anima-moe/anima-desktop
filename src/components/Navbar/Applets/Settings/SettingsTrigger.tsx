import { GearSix } from 'phosphor-react'

import NavIcon from '@/components/Navbar/NavbarIcon'

function NavSettings() {
  // TODO: Fetch notifications
  return (
    <>
      <NavIcon 
      title="No notifications"
      Icon={<GearSix size={24} />}
      onClick={() => {}} />
    </>
  )
}

export default NavSettings
