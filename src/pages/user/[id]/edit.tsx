import { forwardRef, PropsWithChildren, useEffect, useRef, useState } from 'react'
import { useForm, SubmitHandler, Controller } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import { toast } from 'react-toastify'

import axios from 'axios'
import clsx from 'clsx'
import i18next from 'i18next'
import isAnimated from 'is-animated'
import { useAtom } from 'jotai'
import { Activity, CaretDown, CaretUp, CircleNotch, PencilLine, Icon, UserFocus } from 'phosphor-react'
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
import { userPreferedAudio, userPreferedSubtitles } from '@/stores/atoms'

const validateUrl = (url: string) => {
  try {
    new URL(url)
    return url
  } catch (e) {
    return ''
  }
}

const UserEdit = () => {
  const [loading, setLoading] = useState(false)
  const [userAudio, setUserAudio] = useAtom(userPreferedAudio)
  const [userSubtitle, setUserSubtitle] = useAtom(userPreferedSubtitles)
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
    watch,
    setError,
  } = useForm<FormInputs>()

  useEffect(() => {
    if (!userData) {
      return
    }

    setCurrentUserData(userData)
  }, [userData])

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

    if (!isDonator()) {
      const imageInputs: (keyof FormInputs)[] = ['avatar', 'banner', 'background']

      const imageBuffer = (img: string) =>
        axios
          .get(img, { responseType: 'arraybuffer' })
          .then((res) => Buffer.from(res.data))
          .catch(() => Buffer.from(''))

      const validation = await Promise.all(
        imageInputs.map(async (input) => {
          if (isAnimated(await imageBuffer(data[input]))) {
            setError(input, { type: 'manual', message: t('user_edit_save_animated') })
            return true
          }
          return false
        })
      )
      if (validation.some((v) => v)) {
        setLoading(false)
        return
      }
    }

    toast.promise(
      AnimaUser.update(data),
      {
        pending: t('user_edit_save_pending'),
        success: t('user_edit_save_success'),
        error: t('user_edit_save_error'),
      },
      {
        position: 'bottom-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        progress: undefined,
        theme: 'dark',
      }
    )

    setLoading(false)
  }

  type FormInputs = {
    [Key in (typeof inputs)[number]['id'] | (typeof selectors)[number]['id']]: string
  }

  type InputProps = readonly {
    id: 'avatar' | 'banner' | 'background' | 'color' | 'bio'
    type: string
    icon: Icon
    title: string
    footer?: string
    donator?: boolean
    placeholder?: string
  }[]

  const inputs: InputProps = [
    {
      id: 'bio',
      title: t('user_edit_bio'),
      type: 'text',
      icon: UserFocus,
      placeholder: userData?.profile?.bio || 'No bio',
    },
    // { id: 'password', title: t('user_edit_password'), type: 'password', icon: Shield },
    {
      id: 'avatar',
      title: t('user_edit_avatar'),
      type: 'url',
      icon: UserCircle,
      footer: `.webp / .jpg / .jpeg / .png / .gif [${t('user_edit_donator')}]`,
      placeholder: validateUrl(userData?.profile?.avatar),
    },
    {
      id: 'banner',
      title: t('user_edit_banner'),
      type: 'url',
      icon: Image,
      footer: `.webp / .jpg / .jpeg / .png / .gif [${t('user_edit_donator')}]`,
      placeholder: validateUrl(userData?.profile?.banner),
    },
    {
      id: 'background',
      title: t('user_edit_background'),
      type: 'url',
      icon: PaintBucket,
      donator: true,
      footer: '.webp / .jpg / .jpeg / .png / .gif / .mp4 / .webm',
      placeholder: validateUrl(userData?.profile?.background),
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
    { value: 'ja-JP', emoji: '🇯🇵' },
  ]

  const selectors = [
    {
      id: 'language',
      title: t('user_edit_language'),
      options: i18languages,
      default: i18next.language,
    },
    {
      id: 'subtitle',
      title: t('user_edit_subtitle'),
      options: locales,
      default: userPreferedSubtitles,
    },
    { id: 'audio', title: t('user_edit_audio'), options: locales, default: userPreferedAudio },
    {
      id: 'history',
      title: t('user_edit_history'),
      options: [
        { value: t('user_edit_history_public') },
        { value: t('user_edit_history_private') },
      ],
      default: t('user_edit_history_public'),
    },
  ] as const

  const DonatorBadge = () => (
    <span className="rounded bg-primary px-2 py-1 text-sm text-accent">
      {t('user_edit_donator')}
    </span>
  )

  return (
    <GeneralLayout fluid>
       <div className={'cover absolute top-0 left-0 h-screen w-screen overflow-hidden bg-cover'} style={{backgroundImage: `url('${watch().background}')`}}>
        {watch().background ? (
          (watch().background && watch().background.endsWith('.mp4') || watch().background.endsWith('.webm')) && (
            <video autoPlay loop muted className='h-full w-full object-cover' src={watch().background || '/i/splash/mp4'} />
          )
        ) : (
          <video autoPlay loop muted className='h-full w-full object-cover' src='/i/splash.mp4' />
        )}
      </div>
      <div className="absolute top-0 left-0 h-full w-full bg-primary/70 bg-gradient-to-t from-primary to-transparent" />
      <div className="z-[1] my-24 w-full mx-8">
        {watch() && (
          <UserCard
            user={{
              ...currentUserData,
              profile: {
                user_id: currentUserData?.profile?.user_id,
                id: currentUserData?.profile.id,
                ...currentUserData?.profile,
                ...watch(),
              },
            }}
          />
        )}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex w-full flex-col space-y-2 rounded-md bg-secondary p-5 max-w-4xl mx-auto">
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
                      className={input.donator && !isDonator() && 'pr-20'}
                      disabled={input.donator && !isDonator()}
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
                      defaultValue={select.default as string}
                      onSelect={async (value) => {
                        switch (select.id) {
                          case 'language':
                            const { setConfigValue } = await import('@/services/tauri/configValue')

                            setConfigValue('language', value).then(() => {
                              i18next.changeLanguage(value)
                            })
                            break
                          case 'audio':
                            setUserAudio(value)
                            break
                          case 'subtitle':
                            setUserSubtitle(value)
                            break
                          default:
                            break
                        }
                      }}
                    />
                  )}
                />
              </TitleInput>
            ))}
          <Button
            text={t('user_edit_save')}
            Icon={<PencilLine className="order-first mr-4" weight="fill" size={24} />}
            className="ml-auto bg-accent text-primary"
            disabled={loading}
          />
          </div>
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
  <div className="-mt-4 flex flex-col">
    <label htmlFor={id} className="-mb-0.5 mt-3 text-lg text-white/50">
      {title}
    </label>
    {children}
    {footer && <span className="-mt-1 flex text-xs text-subtle">{footer}</span>}
  </div>
)

export default UserEdit
