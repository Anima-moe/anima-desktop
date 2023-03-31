import i18next from 'i18next'
import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

export const splashScreenPageAtom = atom('welcome')
export const splashScreenPagePropsAtom = atom({})
export const displaySearchPortal = atom(false)

export const playerStreamConfig = atom({
  subtitleURL: '',
  subtitleLocale: '',
  subtitleMode: 'soft',
  streamURL: '',
  streamLocale: 'ja-JP',
  streamHeight: 1080,
  streamFormat: 'm3u8',
  streamThumbnail: '',
})
export const playerAvailableHeights = atom<{ src?: string; height: number }[]>([])
export const playerConfigPage = atom<string>('main')
export const playerSwitchingStream = atom(false)

export const userToken = atomWithStorage('anima.userToken', '')

// User preferences
export const userEnabledSubtitles = atomWithStorage('anima.userPref.subtitlesEnabled', true)
export const userPreferedSubtitles = atomWithStorage('anima.userPref.subtitles', i18next.language)
export const userPreferedAudio = atomWithStorage('anima.userPref.audio', 'ja-JP')
export const userPreferedSubtitleMode = atomWithStorage<'soft' | 'hard'>('anima.userPref.subtitleMode', 'soft')
export const userPreferedVolume = atomWithStorage('anima.userPref.volume', '1')
export const userPreferedPlaybackQuality = atomWithStorage('anima.userPref.playbackQuality', 0) // 0 = auto
export const userPreferedPlayerMode = atomWithStorage('anima.userPref.playerMode', 'normal')
export const userPreferedAutoplay = atomWithStorage('anima.userPref.autoplay', true)
export const userPreferedAutoNextEpisode = atomWithStorage('anima.userPref.autoNextEpisode', true)
