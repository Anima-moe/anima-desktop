import { useEffect, useState } from 'react'

import { useAtom } from 'jotai'

import { playerStreamConfig, userPreferedSubtitles } from '@/stores/atoms'
import { getSubtitle, getUserPreferedSubtitle } from '@/utils/stream'
import { useMediaPlayer } from '@vidstack/react'

import SubstationAlpha from '../Subtitles/SubstationAlpha'
import VTTDecoder from '../Subtitles/Vtt'

interface ISubtitleRendererProps {
  streamData: Anima.RAW.EpisodeStream
}

const SubtitleRenderer: React.FunctionComponent<ISubtitleRendererProps> = ({ streamData }) => {
  const MediaPlayer = useMediaPlayer()
  const [streamConfig, setStreamConfig] = useAtom(playerStreamConfig)
  const [currentSubtitleLocale] = useState<string>(null)
  const [userLocale] = useAtom(userPreferedSubtitles)
  const [currentSubtitleURL, setCurrentSubtitleURL] = useState<string>(null)
  const [currentSubtitleFormat, setSubtitleFormat] = useState<string>(null)
    
  // A change on subtitleLocale will trigger this effect
  useEffect(() => {
    if (!MediaPlayer) { return }
    const videoElement = MediaPlayer?.querySelector('video')
    if (!videoElement?.attributes['data-initialized']) { return }

    // This is the first time running this effect, we should look for the user prefered subtitle
    if (!currentSubtitleFormat) {
      const { subtitleLocale, subtitleURL, format } = getUserPreferedSubtitle(streamData, userLocale)

      setStreamConfig({
        ...streamConfig,
        subtitleLocale: subtitleLocale,
        subtitleURL: subtitleURL
      })
      setCurrentSubtitleURL(subtitleURL)
      setSubtitleFormat(format)

      return
    }
    
    // The subtitle locale got updated, if it's disabled we set everything properly
    if (streamConfig.subtitleLocale !== currentSubtitleLocale) {
      const { subtitleURL, format } = getSubtitle(streamData, streamConfig.subtitleLocale)

      setStreamConfig({
        ...streamConfig,
        subtitleURL: subtitleURL
      })
      setCurrentSubtitleURL(subtitleURL === '' ? null : subtitleURL)
      setSubtitleFormat(subtitleURL === '' ? null : format)
      return
    }

  }, [streamConfig.subtitleLocale, streamConfig.streamURL, MediaPlayer])

  return <div className='flex flex-col absolute whitespace-nowrap w-full h-[calc(100%-4rem)] media-paused:!h-[calc(100%-4rem)] media-user-idle:!h-full media-user-idle:!top-0 z-[2] pointer-events-none transition-all duration-200 libassjs-canvas-parent'>
    {currentSubtitleFormat === 'ass' && <SubstationAlpha />}
    {currentSubtitleFormat === 'srt' && <div>Not implemented yet</div>}
    {currentSubtitleFormat === 'vtt' && <VTTDecoder />}
  </div>
}

export default SubtitleRenderer
