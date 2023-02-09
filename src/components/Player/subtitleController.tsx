import { userPreferedSubtitles } from "@/stores/atoms"
import JASSUB from "jassub"
import { readAtom, writeAtom } from 'jotai-nexus';
import { MediaPlayerElement } from "vidstack"
import { playerConfigPage, playerStreamConfig, userEnabledSubtitles } from '../../stores/atoms';

export default class SubtitleController {
  currentSubtitle: string
  currentSubtitleLocale: string
  _streamData: Anima.RAW.EpisodeStream
  _media: MediaPlayerElement
  _renderer: JASSUB

  constructor(media: MediaPlayerElement, streamData: Anima.RAW.EpisodeStream) {
    this._media = media
    this._streamData = streamData

    const opiniatedSubtitle = this.getOpiniatedSubtitle()
    console.log("User opiniated subtitle", this._streamData.subtitles[opiniatedSubtitle])

    if (!this._renderer) {
      import('jassub').then(JASSUB => {
        this.initialize(JASSUB)
        if (!opiniatedSubtitle || this._streamData.subtitles[opiniatedSubtitle]?.url === '') {
          return
        }

        this.requestSubtitleChange(opiniatedSubtitle)
      })
    } else {
      this.requestSubtitleChange(opiniatedSubtitle)
    }

  }

  private initialize(JASSUB) {
    if (!this._renderer) {
      this._renderer = new JASSUB.default({
        // video: this._media.querySelector('video'),
        canvas: document.getElementById('animajassub'),
        asyncRender: true,
        offscreenRender: true,
        subUrl: 'https://libass.github.io/JavascriptSubtitlesOctopus/subtitles/test.ass',
        workerUrl: '/s/jassub-worker.js',
      })

      this._media.addEventListener('provider-change', (e)=>{
        console.warn("PROVIDER CHANGED", this._media.querySelector('video'))
        this._renderer.setVideo(this._media.querySelector('video'))
      })
    }
  }

  public getOpiniatedSubtitle() {
    const userPrefered = readAtom(userPreferedSubtitles)
    const availableSubs = this._streamData.subtitles
    
    console.log("Available subs", availableSubs)
    console.log("User prefered", userPrefered)

    if (!availableSubs) return
    if (userPrefered === '' || !userPrefered || !userEnabledSubtitles) { return '' }


    if (Object.keys(availableSubs).length === 1) {
      return availableSubs[Object.keys(availableSubs)[0]].locale
    }

    console.log("FILTER:", Object.keys(availableSubs).filter(locale => locale === userPrefered)[0])
    return Object.keys(availableSubs).filter(locale => locale === userPrefered)[0]
  }

  public requestSubtitleChange(locale: string) {
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
      this._renderer.freeTrack()
      return
    }

    this.currentSubtitle = this._streamData.subtitles[locale]?.url || ''
    this.currentSubtitleLocale = locale
    this._renderer.setTrackByUrl(this.currentSubtitle)
    writeAtom(userPreferedSubtitles, locale)
    writeAtom(playerStreamConfig, {
      ...readAtom(playerStreamConfig),
      subtitleURL: this.currentSubtitle,
      subtitleLocale: locale
    })
  }
  
}