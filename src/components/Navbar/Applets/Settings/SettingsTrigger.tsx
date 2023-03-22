import { GearSix } from 'phosphor-react'

import NavIcon from '@/components/Navbar/NavbarIcon'

function NavSettings() {
  // TODO: Fetch notifications
  return (
    <>
      <NavIcon 
      title="Settings"
      Icon={<GearSix size={24} />}
      onClick={() => {}} />
    </>
  )
}

export default NavSettings
