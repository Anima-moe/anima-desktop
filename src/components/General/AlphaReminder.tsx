import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { X } from 'phosphor-react'

type Props = {}

function AlphaRemminder({}: Props) {
  const [isVisible, setIsVisible] = useState(true)
  const { t } = useTranslation()

  return isVisible ? (
    <div className="flex flex-row items-center justify-between w-full px-4 py-2 mt-4 text-xs font-semibold bg-red-400 rounded-md select-none text-primary">
      <span className='w-full' dangerouslySetInnerHTML={{__html: t('generic.reminder.alpha')}} />
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

export default AlphaRemminder
