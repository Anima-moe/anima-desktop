import { invoke } from '@tauri-apps/api/tauri'
import { FaDiscord } from 'react-icons/fa'

import { Shield, User, ArrowRight, ArrowSquareOut } from 'phosphor-react'

import IconInput from '@/components/splashscreen/IconTextInput'
import EmojiOptionsInput from '@/components/splashscreen/EmojiSelectionInput'
import Button from '@/components/General/Button'
import { useState, useEffect } from 'react';
import i18next from 'i18next'
import { useTranslation } from 'react-i18next'

const bannerList = ['/splash_image_bocchi.png', '/splash_image.png']
const randomBannerIndex = Math.floor(Math.random() * bannerList.length)
const randomBanner = bannerList[randomBannerIndex]

function SplashScreen() {
  const { t } = useTranslation()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState< { field: string, message: string } | undefined >()

  useEffect(()=>{
    (async()=>{
      // Check if the user is already logged in, if so, redirect to the main page
      const { getConfigValue } =  await import('@/services/tauri/configValue')
      const userToken = await getConfigValue<string>('token')
      if (userToken && userToken) {
        invoke('close_splashscreen')
      }
    })()
  }, [])

  return <main className='bg-primary w-full h-screen flex rounded-lg overflow-hidden items-center'>
    <img src='/anima.svg' className='absolute top-4 left-4'/>
    <div className='w-1/2 h-screen items-center justify-center px-4 py-4 flex flex-col relative'>
      <div className='flex w-full flex-col h-min mt-auto'>
        <h1 className='w-full text-subtle mb-1.5'>{t('splash_welcome')}</h1>
        <EmojiOptionsInput 
          options={[
            { value: 'pt-BR', label: 'Português', emoji: '🇧🇷' },
            { value: 'en-US', label: 'English', emoji: '🇺🇸' },
            { value: 'es-149', label: 'Español', emoji: '🇪🇸'}
          ]}
          onChange={async (value)=>{
            const { setConfigValue } = await import('@/services/tauri/configValue');

            setConfigValue('language', value)
            .then(()=>{
              i18next.changeLanguage(value)
            })
          }} 
        />
        <IconInput Icon={User} placeholder={t('splash_user')} error={error?.field === 'username' && error.message}/>
        <IconInput Icon={Shield} placeholder={t('splash_password')} type='password' error={error?.field === 'password' && error.message}/>
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
              invoke('close_splashscreen')
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
              const { WebviewWindow, appWindow } = await import('@tauri-apps/api/window')
              const { setConfigValue } =  await import('@/services/tauri/configValue')
              await setConfigValue('token', '1234567890')
              // TODO: If error:
              setLoading(false)
              setError({ field: 'username', message: 'Usuário ou senha incorretos' })
              const animaWindow = new WebviewWindow('Anima',{
                fullscreen: false,
                height: 900,
                width: 1600,
                minWidth: 1360,
                minHeight: 720,
                resizable: true,
                title: "Λ ＮＩＭ Λ - [あーにま • Alpha]",
                visible: false,
                transparent: true
              })
              animaWindow.once('tauri://created', () => {
                // invoke('close_splashscreen')
                appWindow.close()
              })
              animaWindow.once('tauri://error', () => {
                setError({ field: 'tauri', message: 'Error creating Anima window, report on our discord!' })
              })
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
        <FaDiscord  className='mr-3' size={24}/>
      </Button>
    </div>
    
    <div data-tauri-drag-region className='w-1/2 flex h-full !bg-center !bg-cover' style={{
      background:`url('${randomBanner}')`, 
    }}/>

    <style>
      {`body { background: transparent }`}
    </style>
  </main>
}

export default SplashScreen