import { ReactNode, useRef } from 'react'
import { useTranslation } from 'react-i18next'

import i18next from 'i18next'
import { ArrowBendDoubleUpLeft, Link, Warning, Clipboard } from 'phosphor-react'

import { getLocaleMetadata } from '@/services/anima/getMetadataFromMedia'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'

import Button from '../General/Button'
import { ErrorDialog } from './ErrorDialog'

export interface IReportErrorProps {
  anime: Anima.RAW.Anime
}

export function ReportError({ anime }: IReportErrorProps) {
  const outputRef = useRef<HTMLDivElement>()
  const { t } = useTranslation()

  if (!anime) return <></>

  return (
    <>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <button className="flex items-center rounded bg-red-400 px-4 py-2 font-semibold text-primary duration-300 hover:bg-secondary hover:text-red-400">
            <Warning size={24} className="mr-4" /> Report
          </button>
        </DropdownMenu.Trigger>

        <DropdownMenu.Portal className="">
          <DropdownMenu.Content
            className="z-50 flex min-w-[20rem] flex-col rounded-md border border-tertiary bg-secondary px-2 py-2"
            sideOffset={6}
            alignOffset={-5}
            align="end"
          >
            <ErrorDialog
              triggerText={t('anima_report_metadata')}
              title={t('anima_report_metadata')}
              description={t('api_streamError_instructions')}
              triggerClassName="cursor-pointer rounded-md bg-secondary px-2 py-2 transition-all duration-200 hover:bg-red-400 hover:text-primary flex text-left"
              acceptText={t('gerenic_copy')}
              accept={() => {
                const content = outputRef.current.textContent
                navigator.clipboard.writeText(content)
              }}
            >
              <div
                className="scroll-y-auto whitespace-wrap mt-2 max-h-[13rem] w-full overflow-y-auto break-words rounded bg-tertiary px-4 py-2"
                ref={outputRef}
              >
                .errmeta{' '}
                {btoa(
                  JSON.stringify({
                    animeId: anime?.id,
                    animeTitle: getLocaleMetadata<Anima.RAW.Anime, Anima.RAW.AnimeMetadata>(anime)?.title || 'Unknown anime title',
                    locale: i18next.language,
                    requestedAt: new Date().toISOString(),
                    report_type: 'metadata',
                  })
                )}
              </div>
            </ErrorDialog>

            <ErrorDialog
              triggerText={t('anima_report_episodes')}
              title={t('anima_report_episodes')}
              description={t('api_streamError_instructions')}
              triggerClassName="cursor-pointer rounded-md bg-secondary px-2 py-2 transition-all duration-200 hover:bg-red-400 hover:text-primary flex text-left"
            >
              <div
                className="scroll-y-auto whitespace-wrap mt-2 max-h-[13rem] w-full overflow-y-auto break-words rounded bg-tertiary px-4 py-2"
                ref={outputRef}
              >
                .errep{' '}
                {btoa(
                  JSON.stringify({
                    animeId: anime?.id,
                    animeTitle: getLocaleMetadata<Anima.RAW.Anime, Anima.RAW.AnimeMetadata>(anime)?.title || 'Unknown anime title',
                    locale: i18next.language,
                    requestedAt: new Date().toISOString(),
                    report_type: 'media',
                  })
                )}
              </div>
            </ErrorDialog>

            <ErrorDialog
              triggerText={t('anima_report_error')}
              title={t('anima_report_error')}
              description={t('api_streamError_instructions')}
              triggerClassName="cursor-pointer rounded-md bg-secondary px-2 py-2 transition-all duration-200 hover:bg-red-400 hover:text-primary flex text-left"
            >
              <div
                className="scroll-y-auto whitespace-wrap mt-2 max-h-[13rem] w-full overflow-y-auto break-words rounded bg-tertiary px-4 py-2"
                ref={outputRef}
              >
                .errstream{' '}
                {btoa(
                  JSON.stringify({
                    animeId: anime?.id,
                    animeTitle: getLocaleMetadata<Anima.RAW.Anime, Anima.RAW.AnimeMetadata>(anime)?.title || 'Unknown anime title',
                    locale: i18next.language,
                    requestedAt: new Date().toISOString(),
                    report_type: 'stream',
                  })
                )}
              </div>
            </ErrorDialog>

            <DropdownMenu.Arrow className="fill-secondary" />
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    </>
  )
}
