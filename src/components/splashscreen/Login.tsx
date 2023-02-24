import { useState, useEffect } from 'react'
import { useForm, SubmitHandler, Controller } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { AxiosError } from 'axios'
import { motion } from 'framer-motion'
import i18next from 'i18next'
import { useAtom } from 'jotai'
import { Shield, User, ArrowRight, ArrowSquareOut, DiscordLogo } from 'phosphor-react'

import Button from '@/components/General/Button'
import EmojiOptionsInput from '@/components/General/Inputs/EmojiSelectionInput'
import IconInput from '@/components/General/Inputs/IconTextInput'
import { User as AnimaUser } from '@/services/anima/user'
import { createMainWindow } from '@/services/tauri/windows'
import { splashScreenPageAtom, splashScreenPagePropsAtom } from '@/stores/atoms'

const bannerList = ['/i/splash_image_bocchi']
const randomBannerIndex = Math.floor(Math.random() * bannerList.length)
const randomBanner = bannerList[randomBannerIndex]

function Login() {
  const { t } = useTranslation()
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useAtom(splashScreenPageAtom)
  const [pageProps, setPageProps] = useAtom(splashScreenPagePropsAtom)

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<FormInputs>()

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    setLoading(true)

    try {
      const userInfo = await AnimaUser.login(data.username, data.password)
      const { setConfigValue } = await import('@/services/tauri/configValue')

      await setConfigValue('token', userInfo.token)
      await window.location.reload()
    } catch (e) {
      if (!e.response?.status) {
        setError('username', { message: 'Anima backend offline' })
        setLoading(false)
        return
      }
      if (e instanceof AxiosError && e.response?.status) {
        setPageProps({ username: data.username, password: data.password })
        setCurrentPage('register')
        return
      }
      setError('password', { message: t('user_wrongAuth') })
      setLoading(false)
    }
  }

  type FormInputs = {
    [Key in (typeof inputs)[number]['id']]: string
  }

  const inputs = [
    { id: 'username', icon: User, title: t('splash_user'), type: 'text' },
    { id: 'password', icon: Shield, title: t('splash_password'), type: 'password' },
  ] as const

  return (
    <motion.main className="flex h-screen w-full items-center overflow-hidden rounded-lg bg-primary">
      <motion.img
        initial={{
          opacity: 0,
          y: -10,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.6,
          delay: 0.8,
          type: 'spring',
          stiffness: 500,
          damping: 60,
          mass: 1,
        }}
        src="/i/anima.svg"
        className="absolute top-4 left-4 z-[1] overflow-hidden"
      />
      <motion.div
        initial={{
          opacity: 0,
          x: -10,
        }}
        animate={{
          opacity: 1,
          x: 0,
        }}
        transition={{
          duration: 0.8,
          type: 'spring',
          stiffness: 500,
          damping: 60,
          mass: 1,
        }}
        className="border-md relative flex h-screen w-1/2 flex-col items-center justify-center px-4 py-4"
      >
        <div className="mt-auto flex h-min w-full flex-col">
          <form onSubmit={handleSubmit(onSubmit)}>
            <h1 className="mb-1.5 w-full text-subtle">{t('splash_welcome')}</h1>
            <EmojiOptionsInput
              options={[
                { value: 'pt-BR', label: 'Português', emoji: '🇧🇷' },
                { value: 'pt-PT', label: 'Português', emoji: '🇵🇹' },
                { value: 'en-US', label: 'English', emoji: '🇺🇸' },
                { value: 'es-419', label: 'Español', emoji: '🇪🇸' },
              ]}
              onSelect={async (value) => {
                const { setConfigValue } = await import('@/services/tauri/configValue')

                setConfigValue('language', value).then(() => {
                  i18next.changeLanguage(value)
                })
              }}
            />
            {inputs.map((input) => (
              <Controller
                key={input.id}
                name={input.id}
                control={control}
                rules={{
                  minLength: {
                    value: 3,
                    message: t('user_minLength', { n: 3 }),
                  },
                  required: {
                    value: true,
                    message: t('user_missingField'),
                  },
                }}
                render={({ field }) => (
                  <IconInput
                    id={input.id}
                    Icon={input.icon}
                    type={input.type}
                    placeholder={input.title}
                    error={errors[input.id]?.message}
                    {...field}
                  />
                )}
              />
            ))}
            <div className="flex w-full flex-row">
              <Button
                Icon={<ArrowRight />}
                iconSubtle
                text={t('splash_continueAsGuest')}
                tertiary
                border
                md
                fluid
                iconRight
                disabled={loading}
                loading={loading}
                type="button"
                className="mr-1.5 mt-1.5 whitespace-nowrap"
                onClick={() => {
                  createMainWindow()
                }}
              />
              <Button
                Icon={<ArrowRight weight="fill" />}
                text={t('splash_loginOrRegister')}
                accent
                iconRight
                md
                className="ml-1.5 mt-1.5"
                disabled={loading}
                loading={loading}
                semibold
              />
            </div>
          </form>
        </div>
        <Button
          text={t('splash_joinDiscord')}
          iconRight
          sm
          secondary
          border
          fluid
          iconSubtle
          className="mt-auto"
          onClick={() => {
            open('https://discord.gg/Muw6QevAFd')
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="currentColor"
            className="mr-4"
            viewBox="0 0 16 16"
          >
            <path d="M13.545 2.907a13.227 13.227 0 0 0-3.257-1.011.05.05 0 0 0-.052.025c-.141.25-.297.577-.406.833a12.19 12.19 0 0 0-3.658 0 8.258 8.258 0 0 0-.412-.833.051.051 0 0 0-.052-.025c-1.125.194-2.22.534-3.257 1.011a.041.041 0 0 0-.021.018C.356 6.024-.213 9.047.066 12.032c.001.014.01.028.021.037a13.276 13.276 0 0 0 3.995 2.02.05.05 0 0 0 .056-.019c.308-.42.582-.863.818-1.329a.05.05 0 0 0-.01-.059.051.051 0 0 0-.018-.011 8.875 8.875 0 0 1-1.248-.595.05.05 0 0 1-.02-.066.051.051 0 0 1 .015-.019c.084-.063.168-.129.248-.195a.05.05 0 0 1 .051-.007c2.619 1.196 5.454 1.196 8.041 0a.052.052 0 0 1 .053.007c.08.066.164.132.248.195a.051.051 0 0 1-.004.085 8.254 8.254 0 0 1-1.249.594.05.05 0 0 0-.03.03.052.052 0 0 0 .003.041c.24.465.515.909.817 1.329a.05.05 0 0 0 .056.019 13.235 13.235 0 0 0 4.001-2.02.049.049 0 0 0 .021-.037c.334-3.451-.559-6.449-2.366-9.106a.034.034 0 0 0-.02-.019Zm-8.198 7.307c-.789 0-1.438-.724-1.438-1.612 0-.889.637-1.613 1.438-1.613.807 0 1.45.73 1.438 1.613 0 .888-.637 1.612-1.438 1.612Zm5.316 0c-.788 0-1.438-.724-1.438-1.612 0-.889.637-1.613 1.438-1.613.807 0 1.451.73 1.438 1.613 0 .888-.631 1.612-1.438 1.612Z" />
          </svg>
        </Button>
      </motion.div>

      <motion.div
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 1,
        }}
        transition={{
          duration: 0.3,
        }}
        exit={{
          x: '100%',
          opacity: 0,
        }}
        className="relative flex h-full w-1/2 overflow-hidden bg-accent !bg-cover !bg-center"
        onMouseDown={(e) => {
          //@ts-expect-error - this is tauri exclusive shit
          window.__TAURI_INVOKE__('tauri', {
            __tauriModule: 'Window',
            message: {
              cmd: 'manage',
              data: {
                cmd: {
                  type: e.detail === 2 ? '__toggleMaximize' : 'startDragging',
                },
              },
            },
          })
        }}
      >
        <motion.div
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
            transition: {
              duration: 1,
              ease: 'linear',
            },
          }}
          className="slider-animation absolute top-0 left-0 h-screen w-screen bg-cover bg-center"
          style={{
            backgroundSize: '45%',
            backgroundImage: `url('${randomBanner}_1.png')`,
          }}
        />
        <motion.div
          initial={{
            opacity: 0,
            y: 50,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.8,
            delay: 0.6,
            type: 'spring',
            stiffness: 500,
            damping: 60,
            mass: 1,
          }}
          className="absolute top-0 left-0 h-full w-full bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('${randomBanner}_2.png')`,
          }}
        />
      </motion.div>
      <style>{'body { background: transparent }'}</style>
    </motion.main>
  )
}

export default Login
