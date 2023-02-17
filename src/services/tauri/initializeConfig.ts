import i18n from 'i18next'

import { getConfigValue } from '@/services/tauri/configValue'

export async function initLanguage() {
  const userLanguage = await getConfigValue<string>('locale')
  i18n.changeLanguage(userLanguage)
}

export async function initUserToken() {}

export async function initPlayer() {}
