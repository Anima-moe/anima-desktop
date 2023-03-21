import React from 'react'
import { useTranslation } from 'react-i18next'

import { useAtom } from 'jotai'
import { Icon, CaretRight } from 'phosphor-react'

import { playerConfigPage } from '@/stores/atoms'

type Props = {
  LeftIcon: Icon
  page: string
  text: string
  value: string
}

function SettingEntry({ LeftIcon, page, text, value }: Props) {
  const [configPage, setConfigPage] = useAtom(playerConfigPage)
  const { t } = useTranslation()

  return (
    <div
      className='flex flex-row items-center justify-between w-full px-2 py-2 duration-300 rounded-md group hover:bg-accent hover:text-primary'
      onClick={() => {
        setConfigPage(page)
      }}
    >
      <span className='flex flex-row items-center w-full'>
        <LeftIcon
          className='p-2 mr-4 rounded-md bg-tertiary group-hover:bg-primary group-hover:text-accent'
          size={32}
          weight='fill'
        />
        {t(text)}
      </span>
      <span className='flex text-right justify-end text-xs text-subtle min-w-[5rem] mr-4'>{value}</span>
      <CaretRight size={24} />
    </div>
  )
}

export default SettingEntry
