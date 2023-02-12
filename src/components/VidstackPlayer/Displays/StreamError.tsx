import React, { useRef } from 'react'
import { useTranslation } from 'react-i18next'

import { Clipboard } from 'phosphor-react'

import Button from '@/components/General/Button'

type Props = {
  error: Error | string
}

function StreamError({error}: Props) {
  const outputRef = useRef(null)
  
  const {t} = useTranslation()
  return (
    <div className='w-full h-full items-center justify-center flex flex-col absolute top-0 left-0'>
      <div className='aspect-video h-[50vh] bg-secondary rounded-md flex flex-row overflow-hidden'>
        <div className={'w-1/2 h-full bg-center bg-cover'} style={{backgroundImage: 'url(/i/bocchi_error.gif)'}}></div>
        <div className='w-1/2  p-4 flex flex-col'>
          <h1 className='font-semibold uppercase'>{t('api_streamError')}</h1>
          <p className='text-sm mt-12'>{t('api_streamError_instructions')}</p>
          <div className='scroll-y-auto w-full break-words whitespace-wrap bg-tertiary px-4 py-2 rounded max-h-[13rem] mt-2 overflow-y-auto' ref={outputRef}>
            {JSON.stringify(`${error}`)}
          </div>
          <Button text={t('copy')} Icon={<Clipboard />} accent fluid xs className='mt-4' onClick={()=>{
            const content = outputRef.current.textContent
            navigator.clipboard.writeText(content)
          }}/>
        </div>
      </div>
    </div>
  )
}

export default StreamError