import { useEffect } from 'react'
import { initReactI18next } from 'react-i18next'
import { QueryClient, QueryClientProvider } from 'react-query'
import { Slide, ToastContainer } from 'react-toastify'

import i18n from 'i18next'
import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import NProgress from 'nprogress'

import enUS from '@/services/i18n/locale/en-US'
import ptBR from '@/services/i18n/locale/pt-BR'
import ptPT from '@/services/i18n/locale/pt-PT'
import 'react-toastify/dist/ReactToastify.min.css'
import '@/styles/globals.css'
import '@/styles/tweaks.scss'
import 'skeleton-elements/css'
import { listen } from '@tauri-apps/api/event'
import Titlebar from '@/components/Layout/Titlebar'

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    lng: 'pt-BR',
    resources: {
      'en-US': { translation: enUS },
      'pt-BR': { translation: ptBR },
      'pt-PT': { translation: ptPT },
    }
  })

NProgress.configure({
  minimum: 0.3,
  easing: 'easeInOut',
  speed: 300,
  showSpinner: false,
})

const queryClient = new QueryClient()

// This default export is required in a new `pages/_app.js` file.
export default function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter()

  useEffect(() => {
    const handleStart = () => {
      NProgress.start()
    }

    const handleStop = () => {
      NProgress.done()
    }

    router.events.on('routeChangeStart', handleStart)
    router.events.on('routeChangeComplete', handleStop)
    router.events.on('routeChangeError', handleStop)

    return () => {
      router.events.off('routeChangeStart', handleStart)
      router.events.off('routeChangeComplete', handleStop)
      router.events.off('routeChangeError', handleStop)
    }
  }, [router])

  useEffect(() => {
    document.addEventListener('contextmenu', (e) => {
      e.preventDefault()
    })
    
    ;(async () => {
      const { getConfigValue } = await import('@/services/tauri/configValue')
      const userLanguage = await getConfigValue<string>('language')
      i18n.changeLanguage(userLanguage)
    })()
  }, [router])

  useEffect(()=>{
    const unlisten = listen('scheme-request-received', (e) => {
      import('@tauri-apps/api/window')
      .then(mod=>{
        mod.appWindow.setFocus()
        const schema = e.payload as string
        const path = schema.replace('anima://', '')
        router.push(`/${path}`)
      })
    })

    return () => {
      unlisten
        .then(f => f())
    }
  }, [])

  return (
    <QueryClientProvider client={queryClient}>
      <Titlebar />
      <Component {...pageProps} />
      <ToastContainer
        transition={Slide}
        draggable={false}
        theme="dark"
        position="bottom-right"
        bodyClassName={() => 'my-auto flex flex-auto select-none items-center py-2'}
      />
    </QueryClientProvider>
  )
}
