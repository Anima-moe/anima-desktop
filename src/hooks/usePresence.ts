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
    await invoke('discord_set_activity', {
      details: `${watching ? t('activity.watching') : t('activity.browsing')} • ${title}`,
      state: `${description}`,
      timestamp: Date.now(),
      image: 'logo_play',
      deepLink: `anima://${deeplink}`,
      button: button || t('activity.button.access'),
    })
  }

  async function clearPresence(path: string, display?: string) {
    if (!path) {
      return
    }

    const { invoke } = await import('@tauri-apps/api')

    await invoke('discord_set_activity', {
      details: display || path,
      state: t('activity.browsing'),
      timestamp: Date.now(),
      image: 'logo',
      deepLink: `anima://${path || '/'}`,
      button: t('activity.button.access'),
    })
  }

  return { setPresence, clearPresence }
}
