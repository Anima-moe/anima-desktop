import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import { motion } from 'framer-motion'
import i18next from 'i18next'
import { useAtom } from 'jotai'
import { Shield, User, ArrowRight, ArrowSquareOut, DiscordLogo } from 'phosphor-react'

import Button from '@/components/General/Button'
import EmojiOptionsInput from '@/components/splashscreen/Inputs/EmojiSelectionInput'
import IconInput from '@/components/splashscreen/Inputs/IconTextInput'
import { User as AnimaUser } from '@/services/anima/user'
import { createMainWindow } from '@/services/tauri/windows'
import { splashScreenPageAtom, splashScreenPagePropsAtom } from '@/stores/atoms'

const bannerList = ['/i/splash_image_bocchi']
const randomBannerIndex = Math.floor(Math.random() * bannerList.length)
const randomBanner = bannerList[randomBannerIndex]

function Login() {
  const { t } = useTranslation()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<{ field: string; message: string } | undefined>()
  const [username, setUserName] = useState('')
  const [password, setPassword] = useState('')
  const [currentPage, setCurrentPage] = useAtom(splashScreenPageAtom)
  const [pageProps, setPageProps] = useAtom(splashScreenPagePropsAtom)

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
          <h1 className="mb-1.5 w-full text-subtle">{t('splash_welcome')}</h1>
          <EmojiOptionsInput
            options={[
              { value: 'pt-BR', label: 'Português', emoji: '🇧🇷' },
              { value: 'en-US', label: 'English', emoji: '🇺🇸' },
              { value: 'es-419', label: 'Español', emoji: '🇪🇸' },
            ]}
            onChange={async (value) => {
              const { setConfigValue } = await import('@/services/tauri/configValue')

            setConfigValue('language', value)
            .then(()=>{
              i18next.changeLanguage(value)
            })
          }} 
        />
        <IconInput Icon={User} placeholder={t('splash_user')} error={error?.message} onChange={(v)=>{ setError(undefined); setUserName(v) }}/>
        <IconInput Icon={Shield} placeholder={t('splash_password')} type='password' error={error?.message} onChange={(v)=>{ setError(undefined); setPassword(v) }}/>
        <div className='flex flex-row w-full'>
          <Button 
            Icon={<ArrowRight />} 
            iconSubtle 
            text={t('splash_continueAsGuest')}
            tertiary 
            border 
            md 
            fluid 
            disabled={loading}
            loading={loading}
            className='mr-1.5 mt-1.5' 
            onClick={()=>{
              createMainWindow()
            }}
          />
          <Button 
            Icon={<ArrowRight />} 
            text={t('splash_loginOrRegister')} 
            accent 
            iconRight 
            md
            className='ml-1.5 mt-1.5' 
            disabled={loading}
            loading={loading}
            semibold 
            onClick={async ()=>{
              // TODO: Login to anima, save token to localstorage
              setLoading(true)
              
              try {
                setLoading(true)
                if (!username || !password || username.length < 3 || password.length < 3) {
                  setLoading(false)
                  setError({ field: 'username', message: t('user_missingField') })
                  return
                }
                const userInfo = await AnimaUser.login(username, password)
                const { setConfigValue } =  await import('@/services/tauri/configValue')

                await setConfigValue('token', userInfo.token)
                console.log('SAVED TOKEN', userInfo.token)
                await window.location.reload()
              } catch (e) {
                if (e?.response?.status) {
                  setLoading(false)
                  setPageProps({ username, password })
                  setCurrentPage('register')
                  return
                } 
                setError({ field: 'username', message: t('user_wrongAuth') })
                setLoading(false)
              }
            }}
          /> 
        </div>
      </div>
      <Button 
        Icon={<ArrowSquareOut />}
        text={t('splash_joinDiscord')}
        iconRight
        sm
        secondary
        border
        fluid
        iconSubtle
        className='mt-auto'
        onClick={()=>{
          open('https://discord.gg/Muw6QevAFd')
        }}
      >
        <DiscordLogo weight='fill' className='mr-3' size={24}/>
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
        duration: .3,
      }}
      exit={{
        x: '100%',
        opacity: 0
      }}
      className='w-1/2 flex h-full !bg-center !bg-cover bg-accent relative overflow-hidden' 
      onMouseDown={(e)=>{
        //@ts-expect-error - this is tauri exclusive shit
        window.__TAURI_INVOKE__('tauri', {
          __tauriModule: 'Window',
          message: {
            cmd: 'manage',
            data: {
              cmd: {
                type: e.detail === 2 ? '__toggleMaximize' : 'startDragging'
              }
            }
          }
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
          }
        }}
        className='w-screen h-screen bg-center bg-cover absolute top-0 left-0 slider-animation'
        style={{
          backgroundSize: '45%',
          backgroundImage:`url('${randomBanner}_1.png')`, 
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
