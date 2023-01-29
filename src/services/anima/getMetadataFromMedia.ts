export type AnimaMediaMetadata = {
  [key: string]: Anima.RAW.AnimeMetadata
}

export function getLocaleMetadata(media: Anima.RAW.Anime | Anima.RAW.Episode) {
  // NOTE: Implement i18n here and get the locale from the current session. 
  let locale = 'en-US'
  return media.metadata[locale] || media.metadata['en-US'] || media.metadata[Object.keys(media.metadata)[0]]
}
