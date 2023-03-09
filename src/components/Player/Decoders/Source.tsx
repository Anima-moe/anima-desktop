import { useCallback, useEffect, useState } from 'react'

import { useAtom } from 'jotai'

import { Stream } from '@/services/anima/stream'
import { User } from '@/services/anima/user'
import { playerAvailableHeights, playerStreamConfig, userPreferedAudio, userPreferedPlaybackQuality, userPreferedSubtitleMode } from '@/stores/atoms'
import { getOpiniatedStream, getUserOpiniatedStream, getUserPrefedStream } from '@/utils/stream'
import { useMediaPlayer, useMediaStore } from '@vidstack/react'

interface ISourceDecoderProps {
  streamData: Anima.RAW.EpisodeStream,
  episodeID: number
}

const SourceDecoder: React.FunctionComponent<ISourceDecoderProps> = ({streamData, episodeID}) => {
  const { canPlay, currentTime, duration, paused } = useMediaStore()
  const MediaPlayer = useMediaPlayer()
  const [currentStreamLocale, setCurrentStreamLocale] = useState('ja-JP')
  const [currentQuality, setCurrentQuality] = useState(0) // 0 = auto
  const [currentSubtitleMode, setCurrentSubtitleMode] = useState<'soft' | 'hard'>( 'soft')
  const [userSubtitleMode] = useAtom(userPreferedSubtitleMode)
  const [userAudioLocale] = useAtom(userPreferedAudio)
  const [userQualityHeight] = useAtom(userPreferedPlaybackQuality)
  const [streamConfig, setStreamConfig] = useAtom(playerStreamConfig)
  const [availableHeights, setAvailableHeights] = useAtom(playerAvailableHeights)

  // UPDATE STREAM URL
  useEffect(()=>{
    if (!MediaPlayer) { return }
    const videoElement = MediaPlayer.querySelector('video')

    // The goal is to ALWAYS pair the user audio preference with the stream that is loaded.
    // This means we are never calling setUser<preference> on the sourceDecoder, we only read it.
    ;(async () => {
      let currentTime: number

      // This is the first time the stream is loaded, we should load userPrefered instead of opiniated
      if (!canPlay && !videoElement.attributes['data-initialized']) {
        const { streamURL, streamFormat, streamLocale, streamQualities } = await getUserPrefedStream(episodeID, streamData, userSubtitleMode, userQualityHeight, userAudioLocale)
        setCurrentStreamLocale(streamLocale)
        setCurrentSubtitleMode(userSubtitleMode)
        setStreamConfig({
          ...streamConfig,
          streamURL: streamURL,
          streamFormat: streamFormat,
          streamThumbnail: streamData?.bif,
          streamLocale
        })
        setAvailableHeights(streamQualities || availableHeights)
        MediaPlayer.startLoading()
        if (videoElement) { videoElement.attributes['data-initialized'] = 'true' }
        return
      } else { currentTime = MediaPlayer.currentTime }

      // The user is only trying to change the subtitle mode, we should get opiniated based on currentStreamLocale
      if (streamConfig.subtitleMode !== currentSubtitleMode) {
        const { streamURL, streamQualities, streamLocale } = await getOpiniatedStream(episodeID, streamData, streamConfig.subtitleMode as 'soft' | 'hard', userQualityHeight, currentStreamLocale)
        setCurrentSubtitleMode(streamConfig.subtitleMode as 'soft' | 'hard')
        setStreamConfig({
          ...streamConfig,
          streamURL: streamURL,
          streamLocale
        })
        MediaPlayer.startLoading()
        MediaPlayer.addEventListener('play', () => {
          if(currentTime) { MediaPlayer.currentTime = currentTime }
        }, { once: true })

        return
      }

      // User changed his audio preference while the stream was already running, meaning the previous state was already working.
      if (canPlay && streamConfig.streamLocale !== currentStreamLocale) {
        const { streamURL, streamFormat, streamLocale, streamQualities } = await getOpiniatedStream(episodeID, streamData, userSubtitleMode, userQualityHeight, streamConfig.streamLocale)
        setCurrentStreamLocale(streamLocale)
        setStreamConfig({
          ...streamConfig,
          streamURL: streamURL,
          streamFormat: streamFormat,
          streamLocale
        })
        setAvailableHeights(streamQualities || availableHeights)
        MediaPlayer.startLoading()
        MediaPlayer.addEventListener('play', () => {
          if(currentTime) { MediaPlayer.currentTime = currentTime }
        }, { once: true })

        return
      }

    })()
  }, [streamConfig.streamLocale, streamConfig.subtitleMode, MediaPlayer])

  // UPDATE STREAM QUALITY
  useEffect(()=>{
    if (!MediaPlayer) { return }

    // HLS ONLY: Hook into manifest to get the available qualities
    MediaPlayer.addEventListener('hls-manifest-parsed', ev => {
      setAvailableHeights(ev.detail.levels
        .sort((a, b) => b.height - a.height)
        .map((level) => {
          return {
            height: level.height,
            src: ''
          }
        }))
    }, { once: true })

    // The quality is already the same as the current video, we don't need to do anything
    if (currentQuality === streamConfig.streamHeight) { return }

    // We will not change quality before being able to play, it's useless and consumes a lot of CPU cycles.
    if (!canPlay) { return }

    // The video can be played, the quality is now different from before and we have to deal with it for different source types.
    if (canPlay && streamConfig.streamHeight !== currentQuality) {
      const providerType = MediaPlayer.provider.type 
      switch (providerType) {
        case 'hls': {
          const provider = MediaPlayer.provider 
          const hls = provider.instance

          const equivalentIndex =  provider.instance.levels.findIndex(level => level.height === streamConfig.streamHeight)
          hls.currentLevel = equivalentIndex
          setStreamConfig({
            ...streamConfig,
            streamHeight: hls.levels[equivalentIndex]?.height || -1,
          })
          setCurrentQuality(equivalentIndex ? streamConfig.streamHeight : -1)
          break
        }
        case 'video': {
        }
        default: {
        }
      }
    }
  }, [streamConfig.streamHeight, MediaPlayer, canPlay])

  // UPDATE USER PLAYERHEAD
  useEffect(()=>{
    if (!MediaPlayer) { return }
    if (!canPlay) { return }
    if (~~currentTime < 15) { return }
    if (!(~~currentTime % 15 === 0) && !paused) { return }
    
    User.postEpisodePlayerHead(episodeID, ~~duration, ~~currentTime)
  }, [~~currentTime, MediaPlayer, canPlay, paused])

  // RECOVER USER PLAYERHEAD
  useEffect(()=>{
    if (!MediaPlayer) { return }
    if (!canPlay) { return }
    
    if (currentTime > 15) { return }

    ;(async () => {
      const { data } = await User.getMyEpisodePlayerHead(episodeID)
      if (data) {
        MediaPlayer.currentTime = data.head
      }
    })()
  }, [MediaPlayer, canPlay])
  return null
}

export default SourceDecoder
