import  { readAtom, writeAtom } from 'jotai-nexus'
import { createStore } from 'jotai/vanilla'
import type { MediaCanLoadEvent, MediaPlayerElement } from 'vidstack'

import { Stream } from '@/services/anima/stream'
import {
  userPreferedAudio,
  userPreferedPlaybackQuality,
  playerSwitchingStream,
  playerStreamConfig
} from '@/stores/atoms'
// import type JASSUB from 'jassub'


export default class SourceController {
  public currentSource = '/i/splash.mp4'
  public currentQuality = 1080
  private _mediaPlayer: MediaPlayerElement
  private _qualityTags = {
    1080: 'FHD',
    720: 'HD',
    480: 'SD',
    360: 'LD',
    240: '🗑️'
  }
  private _availableQualities: { height: number, src: string, tag: string }[]
  private _episodeID: number
  private _streamData: Anima.RAW.EpisodeStream

  constructor(media: MediaPlayerElement, streamData: Anima.RAW.EpisodeStream, episodeData: Anima.RAW.Episode) {
    this._mediaPlayer = media
    this._streamData = streamData
    this._episodeID = episodeData.id
    this.initialize()
  }
  
  private initialize() {
      //----------------------------------------//
      // RESOLVE STREAM VIDEO Qualities
      //----------------------------------------//
      this.initializeStreamQuality()

      //----------------------------------------//
      // RESOLVE STREAM VIDEO SOURCE
      //----------------------------------------//
      const opiniatedStream = this.getOpiniatedStream()
      if (opiniatedStream) {
        Stream.get(this._episodeID, opiniatedStream.external_id)
          .then( newStreamData => {
            if ((newStreamData.data.mp4 || newStreamData.data.hls) === readAtom(playerStreamConfig).streamURL) return
            const streamExtension = newStreamData.data.mp4 ? 'mp4' : 'm3u8'
    
            writeAtom(playerStreamConfig, {
              ...readAtom(playerStreamConfig),
              streamURL: `http://localhost:15411/${btoa(newStreamData.data?.mp4?.filter(s => s.height === this.getOpiniatedQuality()?.height)?.[0].src|| newStreamData.data.hls)}.${streamExtension}`,
              streamLocale: this.getLocaleFromStreamExternalID(this._streamData, opiniatedStream.external_id),
            })

            this.requestSourceChange(opiniatedStream)
            // this._mediaPlayer.addEventListener('can-play', () => {
              // this._mediaPlayer.play()
            // }, { once: true })
          })
      } else {
        this._mediaPlayer.startLoading()
      }
  }

  private initializeStreamQuality() {
    //----------------------------------------//
    // RESOLVE STREAM QUALITY
    //----------------------------------------//
    
    // MP4's should always come with their height from the API.
    if (this._streamData.mp4 && this._streamData.mp4.length > 0) {
      this._availableQualities = this._streamData.mp4.map((mp4) => {
        return {
          height: mp4.height,
          src: mp4.src,
          tag: this._qualityTags[mp4.height.toString()]
        }
      })
    } 

    // HLS's have the quality builtin to the M3U8's file.
    this._mediaPlayer.addEventListener('hls-manifest-parsed', (ev) => {
      this._availableQualities = ev.detail.levels
        .sort((a,b) => a.height - b.height)
        .map((level) => {
          return {
            height: level.height,
            src: '',
            tag: this._qualityTags[level.height.toString()] as string || 'AUTO'
          }
        })

        // console.log("Gathered qualities:", this._availableQualities)
    })
  }

  public getOpiniatedStream() {
    const userPrefered = readAtom(userPreferedAudio)
    const availableAudios = this._streamData.audios

    if (!availableAudios) return
    if (Object.keys(availableAudios).length === 1) {
      return availableAudios[Object.keys(availableAudios)[0]]
    }

    if (userPrefered === '') return Object.keys(availableAudios).map( locale => {
      const s = availableAudios[locale]
      if (s.original) return s
    })[0]

    if (Object.keys(availableAudios).length === 1) {
      return availableAudios[Object.keys(availableAudios)[0]]
    }

    if (availableAudios[userPrefered]) {
      return availableAudios[userPrefered]
    }
  }

  public getOpiniatedQuality() {
    const userPrefered = readAtom(userPreferedPlaybackQuality)
    if (!userPrefered) return this._availableQualities[0]

    return this._availableQualities.map(quality => {
      if (quality.height === userPrefered) {
        return quality
      }
    })[0]
  }

  public async requestSourceChange(newSource: { original: boolean, external_id: string }) {
    const newStreamData = await Stream.get(this._episodeID, newSource.external_id)
    if ((newStreamData.data.mp4 || newStreamData.data.hls) === readAtom(playerStreamConfig).streamURL) return
    const streamExtension = newStreamData.data.mp4 ? 'mp4' : 'm3u8'
    this._mediaPlayer.pause()
    
    const currentTime = this._mediaPlayer.currentTime
    const locale = this.getLocaleFromStreamExternalID(this._streamData, newSource.external_id)
    
    writeAtom(playerSwitchingStream, true)
    writeAtom(playerStreamConfig, {
      ...readAtom(playerStreamConfig),
      streamURL: `http://localhost:15411/${btoa(newStreamData.data?.mp4?.filter(s => s.height === this.getOpiniatedQuality()?.height)?.[0].src|| newStreamData.data.hls)}.${streamExtension}`,
      streamLocale: locale,
    })
    writeAtom(userPreferedAudio, locale)
    this._mediaPlayer.startLoading()

    this._mediaPlayer.addEventListener('can-play', () => {
      this._mediaPlayer.currentTime = currentTime || 0
      setTimeout(()=>{
        this._mediaPlayer.play()
      }, 100)
    }, { once: true })
  }

  public requestAudioChange(locale: string) {
    const matchinSource = this._streamData.audios[locale]
    this._mediaPlayer.currentTime = this._mediaPlayer.currentTime
    
    if (matchinSource) {
      this.requestSourceChange(matchinSource)
    }
  }

  public async requestQualityChange(newQuality: { height: number, src: string, tag: string }) {
    // const currentTime = this._mediaPlayer.currentTime

    // this._mediaPlayer.currentTime = currentTime
  }

  private getLocaleFromStreamExternalID(streamData: Anima.RAW.EpisodeStream, external_id: string) {
   const filteredAudios = Object.keys(streamData.audios).filter(locale => {
      if (streamData.audios[locale].external_id === external_id) {
        return true
      }
    })

    return filteredAudios?.[0]
  }
}