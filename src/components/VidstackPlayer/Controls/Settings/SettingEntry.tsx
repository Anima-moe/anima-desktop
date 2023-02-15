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

function SettingEntry({ LeftIcon, page, text, value } : Props) {
  const [configPage, setConfigPage] = useAtom(playerConfigPage)
  
  return <div className='flex flex-row items-center group justify-between w-full hover:bg-accent hover:text-primary px-2 py-2 rounded-md duration-300' onClick={()=>{
    setConfigPage(page)
  }}>
  <span className='flex flex-row items-center'>
    <LeftIcon className='mr-4 p-2 bg-tertiary group-hover:bg-primary group-hover:text-accent rounded-md' size={32} weight='fill' />
    {text}
  </span>
  <span className='text-xs text-subtle ml-8'>{value}</span>
  <CaretRight />
</div>
}

export default SettingEntry