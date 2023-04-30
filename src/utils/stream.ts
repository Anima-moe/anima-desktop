// NOTE: A function should never return invalid or empty stream
// if the stream is invalid or empty, it should return the default stream.

import { Stream } from '@/services/anima/stream'

export function getStreamFormat(streamData) {
  return streamData?.mp4?.length > 0 ? 'mp4' : 'm3u8'
}

export async function getUserPrefedStream(
  episodeID: number,
  stream: Anima.RAW.EpisodeStream,
  userSubtitleMode: 'soft' | 'hard',
  userQuality: number,
  userAudioLocale: string
) {
  const { streamData, streamLocale } = await getUserPreferedStream(episodeID, stream, userAudioLocale)

  return {
    streamURL:
      getStreamFormat(streamData) === 'mp4'
        ? // Stream is MP4
          userQuality > 0
          ? // User has prefered quality
            streamData.mp4.find((s) => s.height === userQuality)?.src
          : // User has no prefered quality, get the better one
            streamData.mp4.sort((a, b) => b.height - a.height)[0]?.src
        : // Stream is not MP4
        userSubtitleMode === 'soft' && streamData?.hls
        ? // User preference is for soft subbed animes and we have an hls stream
          streamData?.hls
        : // User prefers hard sub or we don't have an softsubbed hls stream
          streamData?.hls_subtitled,
    streamFormat: streamData?.mp4?.length > 0 ? 'mp4' : 'm3u8',
    streamLocale,
    streamQualities: streamData?.mp4,
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
      getStreamFormat(streamData) === 'mp4'
        ? // Stream is MP4
          userQuality > 0
          ? // User has prefered quality
            streamData.mp4.find((s) => s.height === userQuality)?.src
          : // User has no prefered quality, get the better one
            streamData.mp4.sort((a, b) => b.height - a.height)[0]?.src
        : // Stream is not MP4
        subtitleMode === 'soft' && streamData?.hls
        ? // User preference is for soft subbed animes and we have an hls stream
          streamData?.hls
        : // User prefers hard sub or we don't have an softsubbed hls stream
          streamData?.hls_subtitled,
    streamFormat: streamData?.mp4?.length > 0 ? 'mp4' : 'm3u8',
    streamLocale,
    streamQualities: streamData?.mp4,
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
  const subtitles = streamData?.subtitles

  // The user prefers no subtitle at all.
  if (userPreferedLocale === '' || userPreferedLocale === 'Disabled' || !subtitles) {
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
