import { forwardRef, PropsWithChildren, useEffect, useRef, useState } from 'react'
import { useForm, SubmitHandler, Controller } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'

import clsx from 'clsx'
import i18next from 'i18next'
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
import EmojiOptionsInput from '@/components/General/Inputs/EmojiSelectionInput'
import IconInput from '@/components/General/Inputs/IconTextInput'
import GeneralLayout from '@/components/Layout/General'
import UserCard from '@/components/User/UserCard'
import { User as AnimaUser } from '@/services/anima/user'

const UserEdit = () => {
  const [loading, setLoading] = useState(false)
  const {
    data: userData,
    isLoading: userIsLoading,
    error: userError,
  } = useQuery('/api/user/me', () => AnimaUser.me(), {
    refetchOnWindowFocus: false,
  })
  const [currentUserData, setCurrentUserData] = useState<Anima.RAW.User | null>(null)
  const { t } = useTranslation()
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm<FormInputs>()
  
  useEffect(()=>{
    if (!userData) { return }
    
    setCurrentUserData(userData)
  }, [userData])
  const profile = watch()

  // useEffect(()=>{
  //   const subscription = watch((value, { name, type }) => {
  //     console.log(value, setCurrentUserData)
  //     setCurrentUserData({
  //       ...currentUserData,
  //       profile: {
  //         avatar: value.avatar,
  //         banner: value.banner,
  //         background: value.background,
  //         color: value.color,
  //         ...currentUserData.profile
  //       }
  //     })
  //   })
  //   return () => subscription.unsubscribe()
  // },[watch])


  function isDonator() {
    if (!userData) return false

    return userData?.staff || userData?.premium > 0
  }


  if (userIsLoading)
    return (
      <div className="absolute inset-0 flex items-center justify-center">
        <CircleNotch size={100} className="animate-spin" />
      </div>
    )

  const onSubmit: SubmitHandler<FormInputs> = async (data: FormInputs) => {
    setLoading(true)

    try {
      await AnimaUser.update(data)
    } catch {}
    setLoading(false)
  }


  type FormInputs = {
    [Key in (typeof inputs)[number]['id'] | (typeof selectors)[number]['id']]: string
  }

  type InputProps = readonly {
    id: 'avatar' | 'banner' | 'background' | 'color'
    type: string
    icon: Icon
    title: string
    footer?: string
    donator?: boolean
    placeholder?: string
  }[]

  const inputs: InputProps = [
    // {
    //   id: 'email',
    //   title: t('user_edit_email'),
    //   type: 'email',
    //   icon: EnvelopeSimple,
    //   placeholder: userData?.email || 'testet',
    // },
    // { id: 'password', title: t('user_edit_password'), type: 'password', icon: Shield },
    {
      id: 'avatar',
      title: t('user_edit_avatar'),
      type: 'url',
      icon: UserCircle,
      footer: `.webp / .jpg / .jpeg / .png / .gif [${t('user_edit_donator')}]`,
      placeholder: userData?.profile?.avatar,
    },
    {
      id: 'banner',
      title: t('user_edit_banner'),
      type: 'url',
      icon: Image,
      footer: `.webp / .jpg / .jpeg / .png / .gif [${t('user_edit_donator')}]`,
      placeholder: userData?.profile?.banner,
    },
    {
      id: 'background',
      title: t('user_edit_background'),
      type: 'url',
      icon: PaintBucket,
      donator: true,
      footer: '.webp / .jpg / .jpeg / .png / .gif / .mp4 / .webm',
      placeholder: userData?.profile?.background,
    },
    {
      id: 'color',
      title: t('user_edit_color'),
      type: 'color',
      icon: Palette,
      donator: true,
      footer: t('user_edit_color_footer'),
      placeholder: userData?.profile?.color || '#000000',
    },
  ] as const

  const i18languages = [
    { value: 'pt-BR', emoji: '🇧🇷' },
    { value: 'en-US', emoji: '🇺🇸' },
    { value: 'es-419', emoji: '🇪🇸' },
    { value: 'pt-PT', emoji: '🇵🇹' },
  ]
  const locales = [
    { value: 'pt-BR', emoji: '🇧🇷' },
    { value: 'en-US', emoji: '🇺🇸' },
    { value: 'es-419', emoji: '🇪🇸' },
    { value: 'ja-JP', emoji: '🇯🇵'}
  ]

  const selectors = [
    { id: 'language', title: t('user_edit_language'), options: i18languages },
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
        {profile?.background ? (
          (profile?.background.endsWith('.mp4') || profile?.background.endsWith('.webm')) && (
            <video autoPlay loop muted className="h-full w-full object-cover" src={profile?.background} />
          )
        ) : (
          <video autoPlay loop muted className="h-full w-full object-cover" src="/i/splash.mp4" />
        )}
      </div>
      <div className="absolute top-0 left-0 h-full w-full bg-primary/70 bg-gradient-to-t from-primary to-transparent" />
      <div className="z-[1] mx-auto my-24 w-full max-w-2xl">
        { profile && <UserCard user={{
          ...currentUserData,
          profile: {
            user_id: currentUserData?.profile?.user_id,
            id: currentUserData?.profile.id,
            ...currentUserData?.profile,
            ...watch()
          }
        }} /> }
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
                      className={input.donator && !isDonator && 'pr-20'}
                      disabled={!isDonator && input.donator}
                      {...field}
                    >
                      {input.donator && (
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
                      onSelect={(value) => {
                        if (select.id === 'subtitle') {
                          
                        }
                        i18next.changeLanguage(value)
                      }}
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
  <div className='flex flex-col -mt-4'>
    <label htmlFor={id} className="text-lg text-white/50 -mb-0.5 mt-3">
      {title}
    </label>
    {children}
    {footer && <span className="text-xs text-subtle flex -mt-1">{footer}</span>}
  </div>
)

export default UserEdit
