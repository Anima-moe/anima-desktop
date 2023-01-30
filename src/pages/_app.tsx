import i18n from "i18next"
import { initReactI18next } from "react-i18next"
import type { AppProps } from "next/app"
import languageTable from '@/services/i18n/languageTable'

import "@/styles/globals.css"
import { useEffect } from "react"
import { getConfigValue } from '@/services/tauri/configValue'
import { invoke } from "@tauri-apps/api/tauri"

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources: languageTable,
    lng: "pt-BR",
    interpolation: {
      escapeValue: false
    }
  })

// This default export is required in a new `pages/_app.js` file.
export default function MyApp({ Component, pageProps }: AppProps) {
  useEffect(()=>{
    (async ()=>{
      const { getConfigValue } = await import('@/services/tauri/configValue')
      const userLanguage = await getConfigValue<string>('locale')
      i18n.changeLanguage(userLanguage || 'pt-BR')

      const { appWindow } = await import('@tauri-apps/api/window')

      if (!await appWindow.isVisible()) { return }
      await invoke('discord_set_activity', {
        details: 'Assistindo',
        state: 'S1 E1 - Anima test episode',
        timestamp: Date.now(),
        image: 'logo'
      })  
      // discord_set_activity(
      //   details: &str,
      //   state: &str,
      //   timestamp: i64,
      //   image: &str,
      //   client: State<'_, DeclarativeDiscordIpcClient>
      // )
    })()
  }, [])
  return <Component {...pageProps} />;
}
