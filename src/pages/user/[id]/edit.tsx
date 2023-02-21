import { forwardRef, PropsWithChildren, useEffect, useRef, useState } from 'react'
import { useForm, SubmitHandler, Controller } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'

import clsx from 'clsx'
import { Activity, CaretDown, CaretUp, CircleNotch, PencilLine, Icon } from 'phosphor-react'
import {
  Shield,
  User,
  ArrowRight,
  ArrowSquareOut,
  DiscordLogo,
  Palette,
  PaintBucket,
  Image,
  UserCircle,
  EnvelopeSimple,
} from 'phosphor-react'

import Button from '@/components/General/Button'
import GeneralLayout from '@/components/Layout/General'
import EmojiOptionsInput from '@/components/splashscreen/Inputs/EmojiSelectionInput'
import IconInput from '@/components/splashscreen/Inputs/IconTextInput'
import UserCard from '@/components/User/UserCard'
import { User as AnimaUser } from '@/services/anima/user'

const UserEdit = () => {
  const [loading, setLoading] = useState(false)
  const { t } = useTranslation()

  const { data, isLoading } = useQuery('/api/user/me', () => AnimaUser.me(), {
    refetchOnWindowFocus: false,
  })

  const isDonator = useRef(false)

  useEffect(() => {
    if (!isLoading) isDonator.current = !!data?.staff || !!data?.premium
  }, [isLoading])

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInputs>()

  if (isLoading)
    return (
      <div className="absolute inset-0 flex items-center justify-center">
        <CircleNotch size={100} className="animate-spin" />
      </div>
    )

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    setLoading(true)
    console.log(data)
    try {
      const x = await AnimaUser.update(data)
      console.log(x)
    } catch {
      console.log('sdajhdfgsdfdshfsdgfhdsgh')
    }
    setLoading(false)
  }

  const background = '/i/splash.mp4' // example

  type FormInputs = {
    [Key in (typeof inputs)[number]['id'] | (typeof selectors)[number]['id']]: string
  }

  type InputProps = readonly {
    id: string
    type: string
    icon: Icon
    title: string
    footer?: string
    donator?: boolean
    placeholder?: string
  }[]

  const inputs: InputProps = [
    {
      id: 'email',
      title: t('user_edit_email'),
      type: 'email',
      icon: EnvelopeSimple,
      placeholder: data?.email || 'testet',
    },
    // { id: 'password', title: t('user_edit_password'), type: 'password', icon: Shield },
    {
      id: 'avatar',
      title: t('user_edit_avatar'),
      type: 'url',
      icon: UserCircle,
      footer: `.webp / .jpg / .jpeg / .png / .gif [${t('user_edit_donator')}]`,
      placeholder: data?.profile?.avatar,
    },
    {
      id: 'banner',
      title: t('user_edit_banner'),
      type: 'url',
      icon: Image,
      footer: `.webp / .jpg / .jpeg / .png / .gif [${t('user_edit_donator')}]`,
      placeholder: data?.profile?.banner,
    },
    {
      id: 'background',
      title: t('user_edit_background'),
      type: 'url',
      icon: PaintBucket,
      donator: true,
      footer: '.webp / .jpg / .jpeg / .png / .gif / .mp4 / .webm',
      placeholder: data?.profile?.background,
    },
    {
      id: 'color',
      title: t('user_edit_color'),
      type: 'color',
      icon: Palette,
      donator: true,
      footer: t('user_edit_color_footer'),
      placeholder: data?.profile?.color,
    },
  ] as const

  const locales = [
    { value: 'pt-BR', emoji: '🇧🇷' },
    { value: 'en-US', emoji: '🇺🇸' },
    { value: 'es-419', emoji: '🇪🇸' },
  ]

  const selectors = [
    { id: 'subtitle', title: t('user_edit_subtitle'), options: locales },
    { id: 'audio', title: t('user_edit_audio'), options: locales },
    {
      id: 'history',
      title: t('user_edit_history'),
      options: [
        { value: t('user_edit_history_public') },
        { value: t('user_edit_history_private') },
      ],
    },
  ] as const

  const DonatorBadge = () => (
    <span className="rounded bg-primary px-2 py-1 text-sm text-accent">
      {t('user_edit_donator')}
    </span>
  )

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
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex w-full flex-col space-y-2 rounded-md bg-secondary p-5">
            {inputs.map((input, i) => (
              <TitleInput
                id={input.id}
                title={input.title}
                footer={input.footer}
                key={input.id + i}
              >
                <Controller
                  name={input.id}
                  control={control}
                  rules={{ required: false }}
                  defaultValue={input.placeholder}
                  render={({ field }) => (
                    <IconInput
                      Icon={input.icon}
                      id={input.id}
                      type={input.type}
                      error={errors[input.id] && t(errors[input.id].message)}
                      className={input.donator && 'pr-20'}
                      disabled={!isDonator}
                      {...field}
                    >
                      {input.donator && !isDonator && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          <DonatorBadge />
                        </div>
                      )}
                    </IconInput>
                  )}
                />
              </TitleInput>
            ))}
            {selectors.map((select, i) => (
              <TitleInput title={select.title} key={select.id + i}>
                <Controller
                  name={select.id}
                  control={control}
                  render={({ field }) => (
                    <EmojiOptionsInput
                      options={select.options.map((o) => ({ ...o, label: t(o.value) }))}
                      {...field}
                    />
                  )}
                />
              </TitleInput>
            ))}
          </div>
          <Button
            text={t('user_edit_save')}
            Icon={<PencilLine className="order-first mr-4" weight="fill" size={24} />}
            className="ml-auto mt-4 bg-accent text-primary"
            disabled={loading}
          />
        </form>
      </div>
    </GeneralLayout>
  )
}

type TitleInputProps = {
  id?: string
  title: string
  footer?: string
}

const TitleInput = ({ id, title, footer, children }: PropsWithChildren<TitleInputProps>) => (
  <div>
    <label htmlFor={id} className="text-lg text-subtle">
      {title}
    </label>
    {children}
    {footer && <span className="text-sm text-tertiary">{footer}</span>}
  </div>
)

export default UserEdit
