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
    if (this.currentSubtitleLocale && this.currentSubtitleLocale !== '') {
      this.requestSubtitleChange(this.currentSubtitleLocale)
    } else {
      const opiniatedSubtitle = this.getOpiniatedSubtitle()
      if (opiniatedSubtitle && opiniatedSubtitle !== '') {
        this.requestSubtitleChange(opiniatedSubtitle)
      }
    }
  }

  private async buildRenderer(subtitleType: string) {
    this.destroyRenderer()

    if (subtitleType === 'ass') {
        const assJS = await import('assjs')
        const subtitle = await fetch(this.currentSubtitle).then(res => res.text())

        if (!this._renderer) {
          this._renderer = new assJS.default(subtitle, this._media.querySelector('video'))
        }

        const resizeObserver = new ResizeObserver((entries) => {
          this._renderer.resize()
        })

        resizeObserver.observe(this._media)
    }

    if (subtitleType === 'vtt') {
        const track = document.createElement('track')
        track.src = this.currentSubtitle
        track.kind = 'subtitles'
        track.srclang = this.currentSubtitleLocale
        
        this._media.querySelector('video').appendChild(track)
        for (let i = 0; i < this._media.querySelector('video').textTracks.length; i++) {
          this._media.querySelector('video').textTracks[i].mode =  'showing'
        }        
        this._renderer = track
    }
  }

  private destroyRenderer() {
    if (this._renderer) {
      this._renderer?.destroy()
      this._renderer?.remove()
      this._renderer = undefined
    }
  }

  public getOpiniatedSubtitle() {
    const userPrefered = readAtom(userPreferedSubtitles)
    const availableSubs = this._streamData.subtitles

    if (!availableSubs) return
    if (userPrefered === '' || !userPrefered || !userEnabledSubtitles) { return '' }


    if (Object.keys(availableSubs).length === 1) {
      return availableSubs[Object.keys(availableSubs)[0]].locale
    }

    return Object.keys(availableSubs).filter(locale => locale === userPrefered)[0]
  }

  public async requestSubtitleChange(locale: string) {
    if (this._streamData.subtitles[locale] && this.currentSubtitle === this._streamData.subtitles[locale].url && this._renderer) {
      return
    }


    if (locale === '' && !this.currentSubtitle || !locale) {
      this.currentSubtitle = ''
      this.currentSubtitleLocale = ''
      writeAtom(playerStreamConfig, {
        ...readAtom(playerStreamConfig),
        subtitleURL: '',
        subtitleLocale: ''
      })

      writeAtom(userPreferedSubtitles, '')
      if (!this._renderer) { return }
      
      this.destroyRenderer

      return
    }

    this.currentSubtitle = this._streamData.subtitles[locale].url
    this.currentSubtitleLocale = locale

    writeAtom(userPreferedSubtitles, locale)

    writeAtom(playerStreamConfig, {
      ...readAtom(playerStreamConfig),
      subtitleURL: this.currentSubtitle,
      subtitleLocale: locale
    })

    if (!this._media.querySelector('video')) { 
      return
    }

    await this.buildRenderer(this._streamData.subtitles[locale].format)

    this._media.addEventListener('provider-change', (e)=>{
      this.requestSubtitleChange(locale)
    })
  }
  
}