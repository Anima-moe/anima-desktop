namespace Anima {
  namespace RAW {

    type Locales = 'en-US' | 'pt-BR' | 'es-149' | 'de-DE' | 'ja-JP'

    type AnimeMetadata = {
      [key: string]: {
        id: number
        title: string
        synopsis: string
        type: 'anime'
        locale_key: Locale
        anime_id: number
      }
    }

    type Season = {
      id: number
      title: string
      number: number
      anime_id: number
    }

    type Anime = {
      cover: string
      background: string
      slug: string
      external_id: string
      seasons: Season[]
      metadata: Anima.RAW.AnimeMetadata
    }
  }

  namespace API {
    type SearchAnime = {
      count: number
      data: Anima.RAW.Anime[]
    }
  }
}