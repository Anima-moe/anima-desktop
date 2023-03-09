import { useTranslation } from 'react-i18next'

import { Dayjs } from 'dayjs'

import { getLocaleMetadata } from '@/services/anima/getMetadataFromMedia'

export default function usePresence() {
  const { t } = useTranslation()

  async function setPresence({
    watching,
    image,
    title,
    description,
    deeplink,
    button,
  }: {
    watching: boolean
    image: string
    title: string
    description: string
    deeplink?: string
    button?: string
  }) {
    if (!title || !image || !description) {
      return
    }

    const { invoke } = await import('@tauri-apps/api')
    console.table({
      details: `${watching ? t('activity_watching') : t('activity_browsing')} • ${title}`,
      state: `${description}`,
      timestamp: Date.now(),
      image: 'logo_play',
      deepLink: `anima://${deeplink}`,
      button: button || t('activity_button_access'),
    })
    await invoke('discord_set_activity', {
      details: `${watching ? t('activity_watching') : t('activity_browsing')} • ${title}`,
      state: `${description}`,
      timestamp: Date.now(),
      image: 'logo_play',
      deepLink: `anima://${deeplink}`,
      button: button || t('activity_button_access'),
    })
  }

  async function clearPresence(path: string, display?: string) {
    if (!path) {
      return
    }

    const { invoke } = await import('@tauri-apps/api')

    await invoke('discord_set_activity', {
      details: display || path,
      state: t('activity_browsing'),
      timestamp: Date.now(),
      image: 'logo',
      deepLink: `anima://${path || '/'}`,
      button: t('activity_button_access'),
    })
  }

  return { setPresence, clearPresence }
}
