import React, { useRef } from 'react'
import { useTranslation } from 'react-i18next'

import Link from 'next/link'
import { ArrowBendDoubleUpLeft, Clipboard } from 'phosphor-react'

import Button from '@/components/General/Button'

type Props = {
  error: string
}

function StreamError({ error }: Props) {
  const outputRef = useRef(null)

  const { t } = useTranslation()
  return (
    <div className="absolute top-0 left-0 flex h-full w-full flex-col items-center justify-center">
      <div className="flex aspect-video h-[50vh] flex-row overflow-hidden rounded-md bg-secondary">
        <div
          className={'h-full w-1/2 bg-cover bg-center'}
          style={{ backgroundImage: 'url(/i/bocchi_error.gif)' }}
        ></div>
        <div className="flex  w-1/2 flex-col p-4">
          <h1 className="font-semibold uppercase">{t('api_streamError')}</h1>
          <p className="mt-12 text-sm">{t('api_streamError_instructions')}</p>
          <div
            className="scroll-y-auto whitespace-wrap mt-2 max-h-[13rem] w-full overflow-y-auto break-words rounded bg-tertiary px-4 py-2"
            ref={outputRef}
          >
            {error}
          </div>
          <Button
            text={t('copy')}
            Icon={<Clipboard />}
            accent
            fluid
            xs
            className="mt-4"
            onClick={() => {
              const content = outputRef.current.textContent
              navigator.clipboard.writeText(content)
            }}
          />
          <Link href="/">
            <Button
              text="Home"
              iconLeft
              fluid
              tertiary
              Icon={<ArrowBendDoubleUpLeft />}
              className="mt-4"
            />
          </Link>
        </div>
      </div>
    </div>
  )
}

export default StreamError
