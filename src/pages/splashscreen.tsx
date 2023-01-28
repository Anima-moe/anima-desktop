import { invoke } from '@tauri-apps/api/tauri'
import { open } from '@tauri-apps/api/shell'

import { FaDiscord } from 'react-icons/fa'

import { Shield, User, ArrowRight, ArrowSquareOut } from 'phosphor-react'

import IconInput from '@/components/splashscreen/IconTextInput'
import EmojiOptionsInput from '@/components/splashscreen/EmojiSelectionInput'
import Button from '@/components/General/Button'


function SplashScreen() {
  const bannerList = ['/splash_image_bocchi.png', '/splash_image.png']
  const randomBannerIndex = Math.floor(Math.random() * bannerList.length)
  const randomBanner = bannerList[randomBannerIndex]

  return <main className='bg-primary w-full h-screen flex rounded-lg overflow-hidden items-center'>
    <span className='absolute top-4 left-4 font-bold'>Λ ＮＩＭ Λ</span>
    <div className='w-1/2 h-screen items-center justify-center px-4 py-4 flex flex-col relative'>
      <div className='flex w-full flex-col h-min mt-auto'>
        <h1 className='w-full text-subtle mb-1.5'>Vamos começar.</h1>
        <EmojiOptionsInput 
          options={[
            { value: 'pt-BR', label: 'Português', emoji: '🇧🇷' },
            { value: 'en-US', label: 'English', emoji: '🇺🇸' },
            { value: 'es-149', label: 'Español', emoji: '🇪🇸'}
          ]} 
        />
        <IconInput Icon={User} placeholder={'Usuário'}/>
        <IconInput Icon={Shield} placeholder={'Senha'} type='password'/>
        <div className='flex flex-row w-full'>
          <Button 
            Icon={<ArrowRight />} 
            iconSubtle 
            text='Continuar sem uma conta' 
            tertiary 
            border 
            md 
            fluid 
            className='mr-1.5 mt-1.5' 
            onClick={()=>{
              invoke('close_splashscreen')
            }}
          />
          <Button 
            Icon={<ArrowRight />} 
            text='Login/Registro' 
            accent 
            iconRight 
            md
            className='ml-1.5 mt-1.5' 
            semibold 
          /> 
        </div>
      </div>
      <Button 
        Icon={<ArrowSquareOut />}
        text='Junte-se ao nosso servidor do discord'
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
    
    <div data-tauri-drag-region className='w-1/2 flex h-full' style={{background:`url('${randomBanner}')`, backgroundPosition: 'center', backgroundSize: 'cover'}} />

    <style>
      {`body { background: transparent }`}
    </style>
  </main>
}

export default SplashScreen