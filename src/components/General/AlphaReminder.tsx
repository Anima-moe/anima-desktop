import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { X } from 'phosphor-react'

type Props = {}

function AlphaRemminder({}: Props) {
  const [isVisible, setIsVisible] = useState(true)
  const { t } = useTranslation()

  return isVisible ? (
    <div className="flex w-full select-none flex-row items-center justify-between rounded-md bg-red-400 px-4 py-2 text-xs font-semibold text-primary my-4">
      <span className='w-full' dangerouslySetInnerHTML={{__html: t('anima_alpha_reminder')}} />
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
