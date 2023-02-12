import { useTranslation } from 'react-i18next'

import Loading from '@/components/General/Loading'

type Props = {
  background?: string
}

function StreamLoading({background}: Props) {
  const { t } = useTranslation()
  
  return <div className='w-full h-full items-center justify-center flex flex-col absolute top-0 left-0 z-[10] bg-center bg-cover' style={{backgroundImage: `url('${background}')`}}>
  <div className='w-[60vh] h-[30vh] bg-secondary rounded-md flex flex-row overflow-hidden'>
    <div className={'w-1/2 h-full bg-center bg-cover'} style={{backgroundImage: 'url(/i/loading_char.png)'}}></div>
    <div className='w-1/2  p-4 flex flex-col relative items-center'>
      <img src='/i/anima.svg' />
      <h1 className='text-xs font-semibold bottom-4 absolute uppercase'>{t('api_streamLoading')}</h1>
      <div className='absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 items-center justify-center'>
        <Loading sm/>
      </div>
    </div>
  </div>
</div>
}

export default StreamLoading