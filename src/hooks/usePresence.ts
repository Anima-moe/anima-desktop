import { useTranslation } from 'react-i18next'

import { Dayjs } from 'dayjs'

import { getLocaleMetadata } from '@/services/anima/getMetadataFromMedia'

export default function usePresence() {
  const { t } = useTranslation()

  async function setPresence(episode: Anima.RAW.Episode, watching: boolean) {
    if (!episode?.id) {
      return
    }

    const { invoke } = await import('@tauri-apps/api')

    await invoke('discord_set_activity', {
      details: t('activity_details_watching', {
        episode: getLocaleMetadata<Anima.RAW.Episode, Anima.RAW.EpisodeMetadata>(episode)?.title || 'Episode unknown',
        episode_number: episode.number,
      }),
      state: watching ? t('activity_watching') : t('activity_browsing'),
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
