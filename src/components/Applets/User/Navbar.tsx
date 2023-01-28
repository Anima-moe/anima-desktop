import { User } from 'phosphor-react'
import NavIcon from "@/components/Navbar/NavbarIcon"

function Navbar() {
  return <>
  <NavIcon 
    title='No notifications'  
    Icon={<User size={22}/>} 
    onClick={()=>{
    }}
  />
</>
}

export default Navbar