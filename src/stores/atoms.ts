import i18next from 'i18next'
import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

export const splashScreenPageAtom = atom('welcome')
export const splashScreenPagePropsAtom = atom({})
export const displaySearchPortal = atom(false)

export const playerStreamConfig = atom({
  subtitleURL: '',
  subtitleLocale: '',
  streamURL: '/i/splash.mp4',
  streamLocale: ''
})
export const playerConfigPage = atom<string>('main')
export const playerSwitchingStream = atom(false)


// User preferences
export const userEnabledSubtitles = atomWithStorage('anima.userPref.subtitlesEnabled', true)
export const userPreferedSubtitles = atomWithStorage('anima.userPref.subtitles', i18next.language)
export const userPreferedAudio = atomWithStorage('anima.userPref.audio', '')
export const userPreferedVolume = atomWithStorage('anima.userPref.volume', '1')
export const userPreferedPlaybackQuality = atomWithStorage('anima.userPref.playbackQuality', 1080)
export const userPreferedPlayerMode = atomWithStorage('anima.userPref.playerMode', 'normal')