import i18next from "i18next"

export type AnimaMediaMetadata = {
  [key: string]: Anima.RAW.AnimeMetadata
}

export function getLocaleMetadata(media: Anima.RAW.Anime | Anima.RAW.Episode) {
  const locale = i18next.language

  //@ts-expect-error -- Yes, skibbid dab
  if (media.AnimeMetadata) {
    //@ts-expect-error -- Yes, skibbid dab
    return media.AnimeMetadata.find(metadata => metadata.locale_key === locale)
  }

  //@ts-expect-error -- Yes, skibbid dab
  if (media.AnimeEpisodeMetadata) {
    //@ts-expect-error -- Yes, skibbid dab
    return media.AnimeEpisodeMetadata.find(metadata => metadata.locale_key === locale)
  }

  //@ts-expect-error -- Yes, skibbid dab
  if (media.EpisodeMetadata) {
    //@ts-expect-error -- Yes, skibbid dab
    return media.EpisodeMetadata.find(metadata => metadata.locale_key === locale)
  }


  return {}
}
