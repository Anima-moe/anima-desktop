import i18n from "i18next"
import { initReactI18next } from "react-i18next"
import type { AppProps } from "next/app"
import languageTable from '@/services/i18n/languageTable'
import NProgress from 'nprogress'
import { useEffect } from "react"
import { useRouter } from "next/router"
import { QueryClient, QueryClientProvider, useQuery } from 'react-query'

import "@/styles/globals.css"
import 'skeleton-elements/css'


i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources: languageTable,
    lng: "pt-BR",
    interpolation: {
      escapeValue: false
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


  useEffect(()=>{
    (async ()=>{
      const { getConfigValue } = await import('@/services/tauri/configValue')
      const userLanguage = await getConfigValue<string>('language')
      i18n.changeLanguage(userLanguage)

      const { appWindow } = await import('@tauri-apps/api/window')

      if (!await appWindow.isVisible()) { return } 
    })()
  }, [router])
  
  return  (
    <QueryClientProvider client={queryClient}>
        <Component {...pageProps} />
    </QueryClientProvider>
  )
}
