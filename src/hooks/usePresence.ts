import { useTranslation } from 'react-i18next'

import { Dayjs } from 'dayjs'

import { getLocaleMetadata } from '@/services/anima/getMetadataFromMedia'

export default function usePresence() {
  const { t } = useTranslation()

  async function setPresence({ watching, image, title, description }: { watching: boolean; image: string; title: string; description: string }) {
    if (!title || !image || !description) {
      return
    }

    const { invoke } = await import('@tauri-apps/api')

    await invoke('discord_set_activity', {
      details: `${watching ? t('activity_watching') : t('activity_browsing')} • ${title}`,
      state: `${description}`,
      timestamp: Date.now(),
      image: 'logo_play',
    })
  }

  async function clearPresence(path) {
    if (!path) {
      return
    }

    const { invoke } = await import('@tauri-apps/api')

    await invoke('discord_set_activity', {
      details: path,
      state: t('activity_browsing'),
      timestamp: Date.now(),
      image: 'logo',
    })
  }

  return { setPresence, clearPresence }
}
