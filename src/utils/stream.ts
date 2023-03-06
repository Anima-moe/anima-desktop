// NOTE: A function should never return invalid or empty stream
// if the stream is invalid or empty, it should return the default stream.

import { Stream } from '@/services/anima/stream'

export async function getUserPrefedStream(
  episodeID: number,
  stream: Anima.RAW.EpisodeStream,
  userSubtitleMode: 'soft' | 'hard',
  userQuality: number,
  userAudioLocale: string
) {
  const { streamData, streamLocale } = await getUserPreferedStream(episodeID, stream, userAudioLocale)
  // We need to attempt loading the user Prefered quality on MP4's when possible.
  return {
    streamURL:
      // Quality = auto
      userQuality > 0
        ? // If the mp4 object is present, we can attempt to load the user prefered quality.
          streamData?.mp4.length > 0
          ? // If the user prefered quality is present & the quality is not auto, we load it.
            streamData.mp4.find((s) => s.height === userQuality)?.src
          : // If the user prefered quality is not present or the quality is auto, we load the highest quality.
            streamData.mp4.sort((a, b) => b.height - a.height)[0]?.src
        : // If the stream is not MP4 we can decide between softsub and hardsub
        userSubtitleMode === 'soft'
        ? streamData.hls
        : streamData.hls_subtitled,
    streamFormat: streamData.mp4 ? 'mp4' : 'm3u8',
    streamLocale,
    streamQualities: streamData.mp4,
  }
}

// Get's the user prefered stream
export async function getUserPreferedStream(episodeID: number, stream: Anima.RAW.EpisodeStream, userAudioLocale: string) {
  // The default stream is already japanese audio.
  if (userAudioLocale === 'ja-JP') {
    return { streamData: stream, streamLocale: 'ja-JP' }
  }

  // If the user has selected a different audio locale, we need to fetch the stream data again.
  const streamVersion = stream.audios[userAudioLocale]

  // This stream doesn't have what the user wants, so we default to japanese.
  if (!streamVersion) {
    return { streamData: stream, streamLocale: 'ja-JP' }
  }

  const { data } = await Stream.get(episodeID, streamVersion.external_id)

  return { streamData: data, streamLocale: userAudioLocale }
}

export async function getOpiniatedStream(
  episodeID: number,
  stream: Anima.RAW.EpisodeStream,
  subtitleMode: 'soft' | 'hard',
  userQuality: number,
  audioLocale: string
) {
  const { streamData, streamLocale } = await getUserOpiniatedStream(episodeID, stream, audioLocale)

  return {
    streamURL:
      // Quality = auto
      userQuality > 0
        ? // If the mp4 object is present, we can attempt to load the user prefered quality.
          streamData?.mp4.length > 0
          ? // If the user prefered quality is present & the quality is not auto, we load it.
            streamData.mp4.find((s) => s.height === userQuality)?.src
          : // If the user prefered quality is not present or the quality is auto, we load the highest quality.
            streamData.mp4.sort((a, b) => b.height - a.height)[0]?.src
        : // If the stream is not MP4 we can decide between softsub and hardsub
        subtitleMode === 'soft'
        ? streamData.hls
        : streamData.hls_subtitled,
    streamFormat: streamData.mp4 ? 'mp4' : 'm3u8',
    streamLocale,
    streamQualities: streamData.mp4,
  }
}
// Get's fixed stream while keeping other user preferences
// The only differente from getUserPreferedStreamData is that this one doesn't check for the user audio locale.
export async function getUserOpiniatedStream(episodeID: number, stream: Anima.RAW.EpisodeStream, audioLocale: string) {
  const localeMatch = stream.audios[audioLocale]
  if (!localeMatch) {
    return { streamData: stream, streamLocale: 'ja-JP' }
  }

  const { data } = await Stream.get(episodeID, localeMatch.external_id)

  return { streamData: data, streamLocale: audioLocale }
}

export function getUserPreferedSubtitle(streamData: Anima.RAW.EpisodeStream, userPreferedLocale: string) {
  const subtitles = streamData.subtitles

  // The user prefers no subtitle at all.
  if (userPreferedLocale === '' || userPreferedLocale === 'Disabled') {
    return { subtitleURL: '', subtitleLocale: '', format: '' }
  }

  const localeMatch = subtitles[userPreferedLocale]

  // There's no locale matching the user prefered locale, so we return the default locale (The first one in the list).
  if (!localeMatch) {
    return {
      subtitleURL: subtitles[Object.keys(subtitles)[0]]?.url,
      subtitleLocale: Object.keys(subtitles)[0],
      format: subtitles[Object.keys(subtitles)[0]]?.format,
    }
  }

  return { subtitleURL: localeMatch.url, subtitleLocale: userPreferedLocale, format: localeMatch.format }
}

export function getSubtitle(streamData: Anima.RAW.EpisodeStream, locale: string) {
  const subtitles = streamData.subtitles

  if (locale === '' || locale === 'Disabled') {
    return { subtitleURL: '', subtitleLocale: '', format: '' }
  }

  const localeMatch = subtitles[locale]
  if (!localeMatch) {
    return { subtitleURL: '', subtitleLocale: '', format: '' }
  }

  return { subtitleURL: localeMatch.url, subtitleLocale: locale, format: localeMatch.format }
}
