import { useTranslation } from 'react-i18next'

import * as Dialog from '@radix-ui/react-dialog'

import Button from '../General/Button'

export interface IErrorDialogProps {
  triggerText?: string
  triggerClassName?: string
  title: string
  description: string
  accept?: () => void
  acceptText?: string
  cancel?: () => void
  cancelText?: string
  children?: React.ReactNode
}

export function ErrorDialog ({triggerClassName, title, description, accept, cancel, triggerText, acceptText, cancelText, children}: IErrorDialogProps) {
  const { t } = useTranslation()

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button className={triggerClassName}>
          {triggerText}
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed top-0 left-0 inset-0 bg-primary/90 backdrop-blur-lg z-[99]" />
        <Dialog.Content className="fixed z-[100] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col w-1/2 bg-secondary rounded-md p-4">
          <Dialog.Title className="text-subtle">{title}</Dialog.Title>
          <Dialog.Description className="mb-4 mt-1.5">
            {description}
          </Dialog.Description>
            {children}
          <div className='flex items-center justify-end w-full mt-12'>
            <Dialog.Close asChild>
                <button 
                  className="px-4 py-1 duration-300 rounded text-subtle hover:bg-red-400 hover:text-primary" 
                  onClick={cancel}
                >
                  {cancelText || t('generic.action.cancel')}
                </button>
            </Dialog.Close>
            <Dialog.Close asChild>
              <button 
                className='px-4 py-1 ml-4 font-semibold duration-300 rounded-md bg-accent text-primary hover:bg-tertiary hover:text-white'
                onClick={accept}
              >
                {acceptText || t('generic.action.accept')}
              </button>
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
