import { useState } from 'react'

import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'phosphor-react'

type Props = {}

function DonationReminder({}: Props) {
  const [isVisible, setIsVisible] = useState(true)
  return isVisible ? (
    <div className="flex w-full select-none flex-row items-center justify-between rounded-md bg-accent px-4 py-2 text-xs font-semibold text-primary">
      <span>
        Hey, listen! @ Anima.moe we will never force ads on you, we survive on donations. Please
        consider donating to keep the service running ad-free 💞
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
