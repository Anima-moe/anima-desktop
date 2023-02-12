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

    this.initialize()
  }

  private async initialize() {
    if (this._renderer) {
      this._renderer.destroy()
    }

    if (this.currentSubtitleLocale && this.currentSubtitleLocale !== '') {
      this.requestSubtitleChange(this.currentSubtitleLocale)
    } else {
      const opiniatedSubtitle = this.getOpiniatedSubtitle()
      if (opiniatedSubtitle && opiniatedSubtitle !== '') {
        this.requestSubtitleChange(opiniatedSubtitle)
      }
    }
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
    console.log('Requesting subtitle change', locale)
    console.log('Current renderer', this._renderer)
    if (this._streamData.subtitles[locale] && this.currentSubtitle === this._streamData.subtitles[locale].url) {
      return
    }
    

    if (locale === '' && this.currentSubtitle || !locale) {
      console.log('locale is disabled')
      this.currentSubtitle = ''
      this.currentSubtitleLocale = ''
      writeAtom(playerStreamConfig, {
        ...readAtom(playerStreamConfig),
        subtitleURL: '',
        subtitleLocale: ''
      })
      // writeAtom(userPreferedSubtitles, '')
      if (!this._renderer) { return }
      console.log('subtitle was disabled, destroying renderer', this._renderer)
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

    if (!this._media.querySelector('video')) { 
      console.log('No video element found')
      return
    }
    const assJS = await import('assjs')
    console.log('imported assJS')
    const subtitle = await fetch(this.currentSubtitle).then(res => res.text())
    console.log('Got subtitle fetched', subtitle)
    this._renderer = new assJS.default(subtitle, this._media.querySelector('video'))
    console.log('Created renderer', this._renderer)
    this._media.addEventListener('provider-change', (e)=>{
      this._renderer.destroy()
      this.requestSubtitleChange(locale)
    })

  }
  
}