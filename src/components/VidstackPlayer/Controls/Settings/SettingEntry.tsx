import React from 'react'

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

  return (
    <div
      className="group flex w-full flex-row items-center justify-between rounded-md px-2 py-2 duration-300 hover:bg-accent hover:text-primary"
      onClick={() => {
        setConfigPage(page)
      }}
    >
      <span className="flex flex-row items-center">
        <LeftIcon
          className="mr-4 rounded-md bg-tertiary p-2 group-hover:bg-primary group-hover:text-accent"
          size={32}
          weight="fill"
        />
        {text}
      </span>
      <span className="ml-8 text-xs text-subtle">{value}</span>
      <CaretRight />
    </div>
  )
}

export default SettingEntry
