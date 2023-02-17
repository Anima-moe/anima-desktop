import { useTranslation } from 'react-i18next'

import Loading from '@/components/General/Loading'

type Props = {
  background?: string
}

function StreamLoading({ background }: Props) {
  const { t } = useTranslation()

  return (
    <div
      className="absolute top-0 left-0 z-[10] flex h-full w-full flex-col items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url('${background}')` }}
    >
      <div className="flex h-[30vh] w-[60vh] flex-row overflow-hidden rounded-md bg-secondary">
        <div
          className={'h-full w-1/2 bg-cover bg-center'}
          style={{ backgroundImage: 'url(/i/loading_char.png)' }}
        ></div>
        <div className="relative  flex w-1/2 flex-col items-center p-4">
          <img src="/i/anima.svg" />
          <h1 className="absolute bottom-4 text-xs font-semibold uppercase">
            {t('api_streamLoading')}
          </h1>
          <div className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 items-center justify-center">
            <Loading sm />
          </div>
        </div>
      </div>
    </div>
  )
}

export default StreamLoading
