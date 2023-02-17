import { forwardRef } from 'react'
import { useTranslation } from 'react-i18next'

import clsx from 'clsx'
import { Activity, CaretDown, CaretUp } from 'phosphor-react'

import GeneralLayout from '@/components/Layout/General'
import TitleInput, { TitleInputProps } from '@/components/splashscreen/Inputs/TitleInput'
import UserCard from '@/components/User/UserCard'
import * as Select from '@radix-ui/react-select'

const User = () => {
  const { t } = useTranslation()

  const background = '/i/splash.mp4' // example
  const inputs: TitleInputProps[] = [
    { title: t('user_edit_email'), type: 'email' },
    { title: t('user_edit_password'), type: 'password' },
    { title: t('user_edit_avatar'), type: 'url' },
    { title: t('user_edit_banner'), type: 'url' },
    { title: t('user_edit_background'), type: 'url' },
    { title: t('user_edit_color'), type: 'color' },
  ]

  const selects = [
    { title: t('user_edit_subtitle'), options: ['pt-BR', 'en-US', 'es-ES'] },
    { title: t('user_edit_audio'), options: ['pt-BR', 'en-US', 'es-ES'] },
    {
      title: t('user_edit_history'),
      options: [t('user_edit_history_public'), t('user_edit_history_private')],
    },
  ]

  return (
    <GeneralLayout fluid>
      <div className={'cover absolute top-0 left-0 z-[-1] h-full w-full overflow-hidden'}>
        {background ? (
          (background.endsWith('.mp4') || background.endsWith('.webm')) && (
            <video autoPlay loop muted className="h-full w-full object-cover" src={background} />
          )
        ) : (
          <video autoPlay loop muted className="h-full w-full object-cover" src="/i/splash.mp4" />
        )}
      </div>
      <div className="absolute top-0 left-0 h-full w-full bg-primary/70 bg-gradient-to-t from-primary to-transparent" />
      <div className="z-10 mx-auto my-24 w-full max-w-2xl">
        <UserCard />
        <div className="flex w-full flex-col gap-y-4 rounded-md bg-secondary p-5">
          {inputs.map((input, i) => (
            <TitleInput key={i} {...input} />
          ))}
          {selects.map((secs, i) => (
            <Select.Root key={i}>
              <Select.Trigger className="flex w-full items-center justify-between rounded-md border border-tertiary bg-secondary px-3 py-2.5 text-lg leading-none outline-none">
                <Select.Value placeholder={secs.title} />
                <Select.Icon className="">
                  <CaretDown />
                </Select.Icon>
              </Select.Trigger>
              <Select.Portal>
                <Select.Content
                  position="popper"
                  sideOffset={4}
                  className="z-10 w-[var(--radix-select-trigger-width)] overflow-hidden rounded-md border border-tertiary bg-secondary"
                >
                  {/* <Select.ScrollUpButton className="flex h-[25px] cursor-default items-center justify-center bg-secondary">
                    <CaretUp />
                  </Select.ScrollUpButton> */}
                  <Select.Viewport className="">
                    {secs.options.map((a, i) => (
                      <SelectItem key={i} value={a}>
                        {a}
                      </SelectItem>
                    ))}
                  </Select.Viewport>
                  {/* <Select.ScrollDownButton className="flex h-[25px] cursor-default items-center justify-center bg-secondary">
                    <CaretDown />
                  </Select.ScrollDownButton> */}
                </Select.Content>
              </Select.Portal>
            </Select.Root>
          ))}
        </div>
      </div>
    </GeneralLayout>
  )
}

const SelectItem = forwardRef<HTMLDivElement, Select.SelectItemProps>(
  ({ children, className, ...props }, forwardedRef) => {
    return (
      <Select.Item
        className={clsx(
          'relative flex h-[25px] select-none items-center rounded-[3px] pr-[35px] pl-[25px] text-[13px] leading-none data-[disabled]:pointer-events-none data-[highlighted]:outline-none',
          className
        )}
        {...props}
        ref={forwardedRef}
      >
        <Select.ItemText>{children}</Select.ItemText>
      </Select.Item>
    )
  }
)

SelectItem.displayName = 'SelectItem'

export default User
