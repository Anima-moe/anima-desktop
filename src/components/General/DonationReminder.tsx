import { useState } from 'react'

import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'phosphor-react'

type Props = {}

function DonationReminder({}: Props) {
  const [isVisible, setIsVisible] = useState(true)
  return isVisible ? (
    <div className="w-full bg-accent rounded-md text-primary px-4 py-2 text-xs font-semibold justify-between flex-row items-center flex select-none">
      <span>Hey, listen! @ Anima.moe we will never force ads on you, we survive on donations. Please consider donating to keep the service running ad-free 💞</span>
      <X size={16} onClick={()=> { setIsVisible(false) } } className='cursor-pointer' />
    </div> 
  ) : ( 
    <> </>
  )
}

export default DonationReminder