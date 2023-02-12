import { useState } from 'react'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import { motion } from 'framer-motion'
import { Shield, SignIn, User, Envelope } from 'phosphor-react'

import { User as AnimaUser } from '@/services/anima/user'

import Button from '../General/Button'
import IconInput from './Inputs/IconTextInput'


type Props = {
  username: string
  password: string
}

function Register({ password: previousPassword, username: previousUsername }: Props) {
  const [username, setUserName] = useState(previousUsername)
  const [password, setPassword] = useState(previousPassword)
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<{field?: string, message?: string}>({})

  useEffect(()=>{
    document.querySelectorAll('input')
      .forEach((input)=>{
        if (input.type === 'password') {
          input.value = previousPassword
        }
        else if(input.type === 'text') {
          input.value = previousUsername
        }
      })
  }, [])

  const { t } = useTranslation()

  return <div
    className='bg-primary w-screen h-screen overflow-hidden rounded-md flex items-center justify-center'
  >
    <motion.div
       className='w-2/5 rounded-md aspect-video flex items-center flex-col'
      >
      <IconInput Icon={User} placeholder={t('splash_user')} error={error?.field === 'user' && error.message} onChange={(v)=>{ setError(undefined); setUserName(v) }} />
      <IconInput Icon={Envelope} placeholder={t('splash_email')} type='email' error={error?.field === 'email' && error.message} onChange={(v)=>{ setError(undefined); setEmail(v) }} />
      <IconInput Icon={Shield} placeholder={t('splash_password')} type='password' error={error?.field === 'password' && error.message} onChange={(v)=>{ setError(undefined); setPassword(v) }} />
      <Button fluid accent bold border iconRight loading={loading} text={t('splash_loginOrRegister')} Icon={<SignIn weight='fill' size={24} />} className='mt-4' onClick={ async ()=>{
        const { setConfigValue } =  await import('@/services/tauri/configValue')
         setLoading(true)
         // TODO: Use a form validator.. for god's sake
         if (!username|| username.length < 3) {
           setLoading(false)
           setError({ field: 'username', message: t('user_missingField') })
           return
         }

          if (!password || password.length < 3) {
            setLoading(false)
            setError({ field: 'password', message: t('user_missingField') })
            return
          }

          if (!email || email.length < 3) {
            setLoading(false)
            setError({ field: 'email', message: t('user_missingField') })
            return
          }

         try {
           const userInfo = await AnimaUser.login(username, password)
  
           await setConfigValue('token', userInfo.token)
           await window.location.reload()
         } catch(e) {
          if (e?.response?.status === 404) {
            try {
              const newUserInfo = await AnimaUser.register(username, password, email)
    
              await setConfigValue('token', newUserInfo.token)
              await window.location.reload()
            } catch (e) {
              setLoading(false)
              setError({ field: 'user', message: t('user_uniqueTaken') })
            }
          }
         }
      }} />
      <div className='items-center justify-center w-full h-16 flex flex-col mt-auto'>
        <img 
          src="/i/anima.svg" 
          className="w-24 mix" 
        />
        <span className="mt-1 text-xs">あーにま</span>
      </div>
    </motion.div>
    <style>
      {'body { background: transparent }'}
    </style>
  </div>
}

export default Register