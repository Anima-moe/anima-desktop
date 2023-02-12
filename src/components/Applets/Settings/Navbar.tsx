import { Gear } from 'phosphor-react'

import NavIcon from '@/components/Navbar/NavbarIcon'

type Props = {}

function Navbar({}: Props) {
  return  <NavIcon 
    title='Settings'  
    Icon={<Gear size={22}/>} 
    onClick={()=>{
  }}
/>
}

export default Navbar