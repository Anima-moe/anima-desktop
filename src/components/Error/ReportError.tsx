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
          <div>
            <Button 
              Icon={<Warning size={24} />}
              text='Report'
              iconRight
              className='!bg-red-400 text-primary hover:!bg-red-600'
            />
          </div>
        </DropdownMenu.Trigger>

        <DropdownMenu.Portal className="">
          <DropdownMenu.Content
            className="z-50 flex min-w-[20rem] flex-col rounded-md border border-tertiary bg-secondary px-2 py-2"
            sideOffset={6}
            alignOffset={-5}
            align="end"
          >
            <ErrorDialog
              triggerText={t('anime.report.missingMetadata')}
              title={t('anime.report.missingMetadata')}
              description={t('anime.error.instructions')}
              triggerClassName="cursor-pointer rounded-md bg-secondary px-2 py-2 transition-all duration-200 hover:bg-red-400 hover:text-primary flex text-left"
              acceptText={t('generic.action.copy')}
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
                    locale: i18next.language,
                    requestedAt: new Date().toISOString(),
                    error_type: 'missingMetadata',
                  })
                )}
              </div>
            </ErrorDialog>

            <ErrorDialog
              triggerText={t('anime.report.missingEpisodes')}
              title={t('anime.report.missingEpisodes')}
              description={t('anime.report.instructions')}
              triggerClassName="cursor-pointer rounded-md bg-secondary px-2 py-2 transition-all duration-200 hover:bg-red-400 hover:text-primary flex text-left"
              acceptText={t('generic.action.copy')}
              accept={() => {
                const content = outputRef.current.textContent
                navigator.clipboard.writeText(content)
              }}
            >
              <div
                className="scroll-y-auto whitespace-wrap mt-2 max-h-[13rem] w-full overflow-y-auto break-words rounded bg-tertiary px-4 py-2"
                ref={outputRef}
              >
                .errep{' '}
                {btoa(
                  JSON.stringify({
                    animeId: anime?.id,
                    locale: i18next.language,
                    requestedAt: new Date().toISOString(),
                    error_type: 'media',
                  })
                )}
              </div>
            </ErrorDialog>

            <ErrorDialog
              triggerText={t('anime.report.error')}
              title={t('anime.report.error')}
              description={t('anime.error.instructions')}
              triggerClassName="cursor-pointer rounded-md bg-secondary px-2 py-2 transition-all duration-200 hover:bg-red-400 hover:text-primary flex text-left"
              acceptText={t('generic.action.copy')}
              accept={() => {
                const content = outputRef.current.textContent
                navigator.clipboard.writeText(content)
              }}
            >
              <div
                className="scroll-y-auto whitespace-wrap mt-2 max-h-[13rem] w-full overflow-y-auto break-words rounded bg-tertiary px-4 py-2"
                ref={outputRef}
              >
                .errstream{' '}
                {btoa(
                  JSON.stringify({
                    animeId: anime?.id,
                    locale: i18next.language,
                    requestedAt: new Date().toISOString(),
                    error_type: 'stream',
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
