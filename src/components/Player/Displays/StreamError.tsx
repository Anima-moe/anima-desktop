import React from 'react'
import { useTranslation } from 'react-i18next'

type Props = {
  error: Error | string
}

function StreamError({error}: Props) {
  const {t} = useTranslation()
  return (
    <div className='w-full h-full items-center justify-center flex flex-col absolute top-0 left-0'>
      <div className='aspect-video h-[50vh] bg-secondary rounded-md flex flex-row overflow-hidden'>
        <div className={`w-1/2 h-full bg-center bg-cover`} style={{backgroundImage: `url(/i/bocchi_error.gif)`}}></div>
        <div className='w-1/2  p-4 flex flex-col'>
          <h1 className='font-semibold uppercase'>{t('stream_error')}</h1>
          <p className='text-sm mt-12'>{t('stream_error_intructions')}</p>
          <div className='scroll-y-auto w-full break-words whitespace-wrap bg-tertiary px-4 py-2 rounded h-max-[10rem] mt-2'>
            {btoa(JSON.stringify(`${error}`))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default StreamError