import { forwardRef, PropsWithChildren, useEffect, useRef, useState } from 'react'
import { useForm, SubmitHandler, Controller } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import ReactMarkdown from 'react-markdown'
import MdEditor from 'react-markdown-editor-lite'
import { useQuery } from 'react-query'
import { toast } from 'react-toastify'

import axios from 'axios'
import clsx from 'clsx'
import i18next from 'i18next'
import isAnimated from 'is-animated'
import { useAtom } from 'jotai'
import {
  Activity,
  CaretDown,
  CaretUp,
  CircleNotch,
  PencilLine,
  Icon,
  UserFocus,
  FloppyDisk,
} from 'phosphor-react'
import {
  Palette,
  PaintBucket,
  Image,
  UserCircle,
} from 'phosphor-react'
import remarkEmoji from 'remark-emoji'
import remarkGfm from 'remark-gfm'

import Button from '@/components/General/Button'
import EmojiOptionsInput from '@/components/General/Inputs/EmojiSelectionInput'
import IconInput from '@/components/General/Inputs/IconTextInput'
import GeneralLayout from '@/components/Layout/General'
import UserProfileSection from '@/components/User/ProfileSection'
import UserCard from '@/components/User/UserCard'
import { User as AnimaUser } from '@/services/anima/user'
import { userPreferedAudio, userPreferedSubtitles } from '@/stores/atoms'
import remarkEmbed from '@flowershow/remark-embed'

import 'react-markdown-editor-lite/lib/index.css'

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

  const [editorContent, setEditorContent] = useState('')
  const markdownEditor = useRef(null)

  useEffect(() => {
    if (!userData) {
      return
    }

    setCurrentUserData(userData)
  }, [userData])

  const DonatorBadge = () => (
    <span className="px-2 py-1 text-sm rounded bg-primary text-accent">
      {t('user.edit.donator')}
    </span>
  )

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
            setError(input, { type: 'manual', message: t('generic.action.save_animated') })
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

    await toast.promise(AnimaUser.update({
      ...data,
      bio: editorContent || userData.profile.bio || 'No bio :sad_cat:',
    }), {
      pending: t('generic.action.save_pending'),
      success: t('generic.action.save_success'),
      error: t('generic.action.save_error'),
    })

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
      id: 'avatar',
      title: t('user.edit.avatar'),
      type: 'url',
      icon: UserCircle,
      footer: `.webp / .jpg / .jpeg / .png / .gif [${t('user.edit.donator')}]`,
      placeholder: validateUrl(userData?.profile?.avatar),
    },
    {
      id: 'banner',
      title: t('user.edit.banner'),
      type: 'url',
      icon: Image,
      footer: `.webp / .jpg / .jpeg / .png / .gif [${t('user.edit.donator')}]`,
      placeholder: validateUrl(userData?.profile?.banner),
    },
    {
      id: 'background',
      title: t('user.edit.background'),
      type: 'url',
      icon: PaintBucket,
      donator: true,
      footer: '.webp / .jpg / .jpeg / .png / .gif / .mp4 / .webm',
      placeholder: validateUrl(userData?.profile?.background),
    },
    {
      id: 'color',
      title: t('user.edit.color'),
      type: 'color',
      icon: Palette,
      donator: true,
      footer: t('user.edit.color_footer'),
      placeholder: userData?.profile?.color || '#000000',
    },
  ] as const

  const selectors = [
    {
      id: 'history',
      title: t('user.edit.history'),
      options: [
        { value: t('user.edit.history_public') },
        { value: t('user.edit.history_private') },
      ],
      default: t('user.edit.history_public'),
    },
  ] as const


  return (
    <GeneralLayout fluid>
      {/* BACKGROUND */}
      <div
        className={'cover absolute top-0 left-0 h-screen w-screen overflow-hidden bg-cover'}
        style={{ backgroundImage: `url('${watch().background}')` }}
      >
        {watch().background ? (
          ((watch().background && watch().background.endsWith('.mp4')) ||
            watch().background.endsWith('.webm')) && (
            <video
              autoPlay
              loop
              muted
              className="object-cover w-screen h-screen"
              src={watch().background || '/i/splash/mp4'}
            />
          )
        ) : (
          <video autoPlay loop muted className="object-cover w-full h-full" src="/i/splash.mp4" />
        )}
      </div>
      {/* SHADE */}
      <div className="absolute top-0 left-0 w-screen h-screen bg-primary/70 bg-gradient-to-t from-primary to-transparent" />
      <div className="z-[1] mt-28 w-full">
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
            showStatics
            showAddConnectionButton
          />
        )}
        {/* USER CREDENTIALS */}
        <div className='flex flex-row gap-4 px-8 mt-8 z-[1] w-full'>
          <UserProfileSection title='Credentials' overlayColor={userData.profile.color}>
          </UserProfileSection> 
        </div>
        {/* BIO */}
        <div className='flex gap-4 px-8 mt-8 z-[1] w-full'>
          <UserProfileSection title='Bio' overlayColor={userData.profile.color} contentClassName='flex !flex-col'>
            <MdEditor 
              renderHTML={async text => <ReactMarkdown className='anima-markdown' remarkPlugins={[remarkEmbed, remarkGfm, remarkEmoji]}>{text}</ReactMarkdown>}
              table={{
                maxRow: 6,
                maxCol: 6
              }}
              ref={markdownEditor}
              imageAccept='.jpeg,.jpg,.png,.gif,.jpe'
              defaultValue={userData.profile.bio}
              className='w-full rounded-md min-h-[500px] h-[500px]'
              htmlClass='anima-markdown'
              plugins={[
                'header',
                'font-bold',
                'font-italic',
                'font-underline',
                'font-strikethrough',
                'divider',
                'list-unordered',
                'list-ordered',
                'divider',
                'block-quote',
                'block-wrap',
                'block-code-inline',
                'block-code-block',
                'divider',
                'table',
                'image',
                'youtube',
                'blockEmbed',
                'link',
                'divider',
                'clear',
                'logger',
                'mode-toggle',
                'tab-insert',
              ]}
              
              onChange={(e)=>{
                if (!markdownEditor?.current?.nodeMdText?.current) { return }
                if (e.text.length > 700) { markdownEditor.current.nodeMdText.current.value =  e.text.slice(0, 700)}
                setEditorContent(e.text.slice(0, 700))
              }}
            />
            <span className={`mt-1 ml-auto ${editorContent.length > 650 ? 'text-red-400' : 'text-subtle'}`}>
              {editorContent.length}/700
            </span>
            <Button
              text={t('generic.action.save')}
              Icon={<FloppyDisk className="order-first ml-4" weight="duotone" size={24} />}
              className="mt-4 ml-auto bg-accent text-primary hover:bg-tertiary hover:text-accent"
              disabled={loading}
              onClick={handleSubmit(onSubmit)}
            />
          </UserProfileSection>
        </div>
        {/* PROFILE CUSTOMIZATION */}
        <div className='flex flex-row gap-4 px-8 my-8 z-[1] w-full'>
          <UserProfileSection title='Profile customization' overlayColor={userData.profile.color}>
            <form className='w-full' onSubmit={handleSubmit(onSubmit)}>
              <div className="flex flex-col w-full mx-auto space-y-2">
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
                            <div className="absolute -translate-y-1/2 right-3 top-1/2">
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
                        />
                      )}
                    />
                  </TitleInput>
                ))}
                <Button
                  text={t('generic.action.save')}
                  Icon={<FloppyDisk className="order-first ml-4" weight="duotone" size={24} />}
                  className="mt-4 ml-auto bg-accent text-primary hover:bg-tertiary hover:text-accent"
                  disabled={loading}
                />
              </div>
            </form>
          </UserProfileSection> 
        </div>
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
  <div className="flex flex-col -mt-4">
    <label htmlFor={id} className="-mb-0.5 mt-3 text-lg text-white/50">
      {title}
    </label>
    {children}
    {footer && <span className="flex -mt-1 text-xs text-subtle">{footer}</span>}
  </div>
)

export default UserEdit
