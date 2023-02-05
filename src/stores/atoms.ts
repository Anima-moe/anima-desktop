import { atom } from 'jotai'

export const splashScreenPageAtom = atom('welcome')
export const splashScreenPagePropsAtom = atom({})

export const playerStreamConfig = atom({
  subUrl: '',
  streamURL: '',
  audioLocale: '',
  subLocale: '',
  configPage: undefined
})

export const playerUserPreferences = atom({
  subLocale: '',
  audioLocale: '',
  lastInterruption: undefined,
})