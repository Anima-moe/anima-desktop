import { forwardRef, PropsWithChildren, useState } from 'react'
import { useForm, SubmitHandler, Controller } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'

import clsx from 'clsx'
import { Activity, CaretDown, CaretUp, CircleNotch, PencilLine } from 'phosphor-react'
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

  function fetchInfo() {
    return AnimaUser.me()
  }
  const { data, isLoading, error } = useQuery('/api/user/me', () => fetchInfo(), {
    cacheTime: 0,
    retry: 1,
    refetchOnWindowFocus: false,
  })

  console.log(data)

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInputs>({
    defaultValues: {
      email: data?.email,
      avatar: data?.profile.avatar,
      banner: data?.profile.banner,
      background: data?.profile.background,
      color: data?.profile.color,
      // subtitle:data?.,
      // audio:data?.,
      // history:data?.,
    },
  })

  if (isLoading)
    return (
      <div className="absolute inset-0 flex items-center justify-center">
        <CircleNotch size={60} className="animate-spin" />
      </div>
    )

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    setLoading(true)
    try {
      await AnimaUser.update(data)
      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }

  const background = '/i/splash.mp4' // example

  type FormInputs = {
    [Key in (typeof inputs)[number]['id'] | (typeof selectors)[number]['id']]: string
  }

  const inputs = [
    { id: 'email', title: t('user_edit_email'), type: 'email', icon: EnvelopeSimple },
    { id: 'password', title: t('user_edit_password'), type: 'password', icon: Shield },
    { id: 'avatar', title: t('user_edit_avatar'), type: 'url', icon: UserCircle },
    { id: 'banner', title: t('user_edit_banner'), type: 'url', icon: Image },
    {
      id: 'background',
      title: t('user_edit_background'),
      type: 'url',
      icon: PaintBucket,
      donator: true,
    },
    { id: 'color', title: t('user_edit_color'), type: 'color', icon: Palette, donator: true },
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

  const DonatorBadge = (
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
              <TitleInput id={input.id} title={input.title} key={input.id + i}>
                <Controller
                  name={input.id}
                  control={control}
                  render={({ field }) => (
                    <IconInput
                      Icon={input.icon}
                      id={input.id}
                      type={input.type}
                      error={errors[input.id] && t(errors[input.id].message)}
                      {...field}
                    />
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

const TitleInput = ({ id, title, children }: PropsWithChildren<TitleInputProps>) => (
  <div>
    <label htmlFor={id} className="text-lg text-subtle">
      {title}
    </label>
    {children}
  </div>
)

export default UserEdit
