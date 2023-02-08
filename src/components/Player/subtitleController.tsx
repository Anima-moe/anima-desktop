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

    console.log("Subscribing to media event -> Play -> Render subtitle / Replace track URL")


    console.log("Media player is playing, initializing subtitle controller")

    const opiniatedSubtitle = this.getOpiniatedSubtitle()
    console.log("User opiniated subtitle", this._streamData.subtitles[opiniatedSubtitle])

    if (!this._renderer) {
      console.log("JASSUB is not initialized, initializing JASSUB")
      import('jassub').then(JASSUB => {
        this.initialize(JASSUB)
        if (!opiniatedSubtitle || this._streamData.subtitles[opiniatedSubtitle].url === '') {
          console.log("No subtitle available / user disabled subtitle")
          return
        }

        this.requestSubtitleChange(opiniatedSubtitle)
      })
    } else {
      this.requestSubtitleChange(opiniatedSubtitle)
    }

  }

  private initialize(JASSUB) {
    console.log("JASSUB")

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

      console.log("RENDERER", this._renderer)
    } else {
      console.log("OLD RENDERER", this._renderer)
    }
  }

  public getOpiniatedSubtitle() {
    const userPrefered = readAtom(userPreferedSubtitles)
    const availableSubs = this._streamData.subtitles
    
    console.log("Available subs", availableSubs)
    console.log("User prefered", userPrefered)

    if (!availableSubs) return
    if (userPrefered === '' || !userPrefered || !userEnabledSubtitles) { return '' }

    console.log("User has subs enabled, it's no an empty string and there's available subs")

    if (Object.keys(availableSubs).length === 1) {
      return availableSubs[Object.keys(availableSubs)[0]].locale
    }

    console.log("There's more than one subtitle available")
    console.log("FILTER:", Object.keys(availableSubs).filter(locale => locale === userPrefered)[0])
    return Object.keys(availableSubs).filter(locale => locale === userPrefered)[0]
  }

  public requestSubtitleChange(locale: string) {
    console.log('Requesting subtitle change to', locale, this._renderer)
    if (!this._renderer) { return }
    console.log("Available subtitles:", this._streamData.subtitles)
    if (this.currentSubtitle === this._streamData.subtitles[locale].url) {
      console.log("Same subtitle, skipping")
      return
    }
    
    console.log("Subtitle is not the same as before, proceeding with change procedures")

    if (locale === '' && this.currentSubtitle || !locale) {
      console.log("Apparently requested to change subtitles to empty string?")
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

    console.log("Requesting jassub track change!")
    this.currentSubtitle = this._streamData.subtitles[locale].url
    this.currentSubtitleLocale = locale
    this._renderer.setTrackByUrl(this.currentSubtitle)
    console.log("JASSUB track changed!", this._media.querySelector('video'), this._renderer)
    writeAtom(userPreferedSubtitles, locale)
    writeAtom(playerStreamConfig, {
      ...readAtom(playerStreamConfig),
      subtitleURL: this.currentSubtitle,
      subtitleLocale: locale
    })
  }
  
}