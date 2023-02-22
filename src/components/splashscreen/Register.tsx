import { useEffect, useState } from 'react'
import { useForm, SubmitHandler, Controller } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { AxiosError } from 'axios'
import { motion } from 'framer-motion'
import { Shield, SignIn, User, Envelope } from 'phosphor-react'

import { User as AnimaUser } from '@/services/anima/user'

import Button from '../General/Button'
import IconInput from '../General/Inputs/IconTextInput'

type Props = {
  username: string
  password: string
}

function Register({ password: previousPassword, username: previousUsername }: Props) {
  const [loading, setLoading] = useState(false)
  const { t } = useTranslation()

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<FormInputs>({
    defaultValues: {
      username: previousUsername,
      password: previousPassword,
    },
  })

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    const { setConfigValue } = await import('@/services/tauri/configValue')
    setLoading(true)

    try {
      const userInfo = await AnimaUser.login(data.username, data.password)

      await setConfigValue('token', userInfo.token)
      await window.location.reload()
    } catch (e) {
      if (e instanceof AxiosError && e.response.status === 404) {
        try {
          const newUserInfo = await AnimaUser.register(data.username, data.password, data.email)

          await setConfigValue('token', newUserInfo.token)
          await window.location.reload()
        } catch (e) {
          setLoading(false)
          setError('username', { message: t('user_uniqueTaken') })
        }
      }
      setLoading(false)
    }
  }

  type FormInputs = {
    [Key in (typeof inputs)[number]['id']]: string
  }

  const inputs = [
    { id: 'username', icon: User, title: t('splash_user'), type: 'text' },
    { id: 'email', icon: Envelope, title: t('splash_email'), type: 'email' },
    { id: 'password', icon: Shield, title: t('splash_password'), type: 'password' },
  ] as const

  return (
    <div className="flex h-screen w-screen items-center justify-center overflow-hidden rounded-md bg-primary">
      <motion.div className="flex aspect-video w-2/5 flex-col items-center rounded-md">
        <form onSubmit={handleSubmit(onSubmit)}>
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
          <Button
            fluid
            accent
            bold
            border
            iconRight
            loading={loading}
            text={t('splash_loginOrRegister')}
            Icon={<SignIn weight="fill" size={24} />}
            className="mt-4"
            onClick={async () => {}}
          />
        </form>
        <div className="mt-auto flex h-16 w-full flex-col items-center justify-center">
          <img src="/i/anima.svg" className="mix w-24" />
          <span className="mt-1 text-xs">あーにま</span>
        </div>
      </motion.div>
      <style>{'body { background: transparent }'}</style>
    </div>
  )
}

export default Register
