import JASSUB from 'jassub'
import { readAtom, writeAtom } from 'jotai-nexus'
import { MediaPlayerElement } from 'vidstack'

import { userPreferedSubtitles } from '@/stores/atoms'

import { playerConfigPage, playerStreamConfig, userEnabledSubtitles } from '../../stores/atoms'

export default class SubtitleController {
  currentSubtitle: string
  currentSubtitleLocale: string
  _streamData: Anima.RAW.EpisodeStream
  _media: MediaPlayerElement
  _renderer

  constructor(media: MediaPlayerElement, streamData: Anima.RAW.EpisodeStream) {
    this._media = media
    this._streamData = streamData

    import('assjs')
       .then(mod => {
         
       })
  }


  public getOpiniatedSubtitle() {
    const userPrefered = readAtom(userPreferedSubtitles)
    const availableSubs = this._streamData.subtitles
    
    console.log('Available subs', availableSubs)
    console.log('User prefered', userPrefered)

    if (!availableSubs) return
    if (userPrefered === '' || !userPrefered || !userEnabledSubtitles) { return '' }


    if (Object.keys(availableSubs).length === 1) {
      return availableSubs[Object.keys(availableSubs)[0]].locale
    }

    console.log('FILTER:', Object.keys(availableSubs).filter(locale => locale === userPrefered)[0])
    return Object.keys(availableSubs).filter(locale => locale === userPrefered)[0]
  }

  public async requestSubtitleChange(locale: string) {
    if (!this._renderer) { return }
    if (this._streamData.subtitles[locale] && this.currentSubtitle === this._streamData.subtitles[locale].url) {
      return
    }
    

    if (locale === '' && this.currentSubtitle || !locale) {
      this.currentSubtitle = ''
      this.currentSubtitleLocale = ''
      writeAtom(playerStreamConfig, {
        ...readAtom(playerStreamConfig),
        subtitleURL: '',
        subtitleLocale: ''
      })
      // writeAtom(userPreferedSubtitles, '')
      if (!this._renderer) { return }
      this._renderer.destroy()
      return
    }

    this.currentSubtitle = this._streamData.subtitles[locale]?.url || ''
    this.currentSubtitleLocale = locale
    writeAtom(userPreferedSubtitles, locale)
    writeAtom(playerStreamConfig, {
      ...readAtom(playerStreamConfig),
      subtitleURL: this.currentSubtitle,
      subtitleLocale: locale
    })

    const assJS = await import('assjs')
  
    const subtitle = await fetch(this.currentSubtitle).then(res => res.text())
    this._renderer = new assJS(subtitle, this._media.querySelector('video'), {

    })

    this._media.addEventListener('provider-change', (e)=>{
      this._renderer.destroy()
      this.requestSubtitleChange(locale)
    })

  }
  
}