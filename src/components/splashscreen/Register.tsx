import { useEffect, useState } from 'react'
import { useForm, SubmitHandler, Controller } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import { AxiosError } from 'axios'
import { motion } from 'framer-motion'
import { useAtom } from 'jotai'
import { Shield, SignIn, User, Envelope, ArrowLeft } from 'phosphor-react'

import { User as AnimaUser } from '@/services/anima/user'
import { splashScreenPageAtom, userToken } from '@/stores/atoms'

import Button from '../General/Button'
import IconInput from '../General/Inputs/IconTextInput'

type Props = {
  username: string
  password: string
}

function Register({ password: previousPassword, username: previousUsername }: Props) {
  const [loading, setLoading] = useState(false)
  const [storedToken, setStoredToken] = useAtom(userToken)
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
  const [splashPage, setSplashPage] = useAtom(splashScreenPageAtom)

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    setLoading(true)
    try {
      const userToken = await AnimaUser.login(data.username, data.password)
      setStoredToken(userToken.token)
      window.location.reload()
      toast.done(t('success.auth.login'))
    } catch (e) {
      if (e instanceof AxiosError) {
        setLoading(false)
        switch(e.response.status) {
          case 401: {
            try {
              await AnimaUser.register(data.username, data.password, data.email)

              setSplashPage('login')
            } catch {
              setLoading(false)
              return setError('password', { message: t('user.auth.error.invalidCredentials') })
            }
            break
          }
          case 400: {
            setLoading(false)
            setError('password', { message: t('user.auth.error.weakPassword') })
            break
          }
          case 404: {
            await AnimaUser.register(data.username, data.password, data.email)
            
            setLoading(false)
            setSplashPage('login')
            break
          }
        }
      }
    }
  }

  type FormInputs = {
    [Key in (typeof inputs)[number]['id']]: string
  }

  const inputs = [
    { id: 'username', icon: User, title: t('user.auth.username'), type: 'text' },
    { id: 'email', icon: Envelope, title: t('user.auth.email'), type: 'email' },
    { id: 'password', icon: Shield, title: t('user.auth.password'), type: 'password' },
  ] as const

  return (
    <div className="flex items-center justify-center w-screen h-screen overflow-hidden rounded-md bg-primary">
      <motion.div
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
          delay: 0.3,
          type: 'spring',
          stiffness: 500,
          damping: 60,
          mass: 1,
        }}
        className="absolute top-4 left-4 z-[1] overflow-hidden cursor-pointer rounded-md p-2 hover:text-accent hover:bg-secondary duration-200 flex gap-2 text-subtle font-medium"
        onClick={()=>{
          setSplashPage('login')
        }}
      >
        <ArrowLeft size={24} /> Login
      </motion.div>
      <motion.div className="flex flex-col items-center w-2/5 rounded-md aspect-video">
        <form onSubmit={handleSubmit(onSubmit)}>
          {inputs.map((input) => (
            <Controller
              key={input.id}
              name={input.id}
              control={control}
              rules={{
                minLength: {
                  value: 3,
                  message: t('user.auth.error.tooShort', { n: 3 }),
                },
                required: {
                  value: true,
                  message: t('user.auth.error.missingField'),
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
            text={t('user.auth.loginRegister')}
            Icon={<SignIn weight="fill" size={24} />}
            className="mt-4"
          />
        </form>
        <div className="flex flex-col items-center justify-center w-full h-16 mt-auto">
          <img src="/i/anima.svg" className="w-24 mix" />
          <span className="mt-1 text-xs">あーにま</span>
        </div>
      </motion.div>
      <style>{'body { background: transparent }'}</style>
    </div>
  )
}

export default Register
