import { useState } from 'react'

import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'phosphor-react'

type Props = {
  content?: string
}

function DonationReminder({content}: Props) {
  const [isVisible, setIsVisible] = useState(true)
  return isVisible ? (
    <div className="flex flex-row items-center justify-between w-full px-4 py-2 text-xs font-semibold rounded-md select-none bg-accent text-primary">
      <span>
        {content || 'Hey, listen! @ Anima.moe we will never force ads on you, we survive on donations. Please consider donating to keep the service running ad-free 💞'}
      </span>
      <X
        size={16}
        onClick={() => {
          setIsVisible(false)
        }}
        className="cursor-pointer"
      />
    </div>
  ) : (
    <></>
  )
}

export default DonationReminder
