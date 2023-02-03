namespace Anima {
  namespace ENUM {
    enum Premium {
      FREE = 0,
      DONATOR = 1,
      LORD = 2,
      GOD = 3
    }
  }
  namespace RAW {

    type Locales = 'en-US' | 'pt-BR' | 'es-149' | 'de-DE' | 'ja-JP'

    type CategoryMetadata = {
      title: string,
      description: string,
      category_id: number,
      locale_key: Locales
    }

    type Category = {
      id: number,
      slug: string,
      locale: string,
      CategoryMetadata: CategoryMetadata
    }

    type AnimeMetadata = {
      id: number
      title: string
      synopsis: string
      type: 'anime'
      locale_key: Locale
      anime_id: number
    }

    type EpisodeMetadata = {
      title?: string
      synopsis?: string
      episode_id: number
      locale_key: Locales
    }

    type EpisodeSource = {
      id: number
      external_id: string
      source_id: number
      locale_key: string
    }

    type Season = {
      id: number
      title: string
      number: number
      anime_id: number
      AnimeEpisode: Anima.RAW.Episode[]
    }

    type Anime = {
      id: number
      cover: string
      background: string
      slug: string
      external_id: string
      AnimeSeason: Season[]
      AnimeMetadata: Anima.RAW.AnimeMetadata[]
      Category: Anima.RAW.Category[]
    }

    type Episode = {
      id: number
      number: number
      season_id: number
      source_id: number
      thumbnail?: string
      EpisodeMetadata: EpisodeMetadata[]
      source: EpisodeSource[]
    }

    type EpisodeStream = {
      source: number
      hls: string
      hls_subtitled: string
      subtitles: {
        [key: string]: {
          format: 'ass',
          locale: Locales,
          url: string
        }
      }
      bif: string
      audios: {
        [key: string]: {
          original: boolean,
          external_id: string
        }
      }
    }

    type User = {
      id: number,
      username: string
      email: string
      picture?: string
      background?: string
      isStaff: boolean
      premium: ENUM.Premium
    }
  }

  namespace API {
    type Error = {
      error: true,
      message: string
    }

    type SearchAnimes = {
      count: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7
      data: Anima.RAW.Anime[]
    } // Returns empty array if none found

    type GetAnimeByID = {
      counter: 1
      data: Anima.RAW.Anime
    } // Returns Error if anime not found

    type GetAnimes = {
      count: number
      data: Anima.RAW.Anime[]
    } // Returns empty array if not found

    type GetAnimeSeasons = {
      count: number
      data: Anima.RAW.Season[]
    } // Returns empty array if no season | Returns Error if anime not found

    type GetEpisodeByID = {
      count: 1
      data: [Anima.RAW.Episode]
    } // Returns Error if episode not found

    type GetSeasonByID = {
      count: 1
      data: [Anima.RAW.Season]
    } // Returns Error if season not found

    type GetSeasonEpisodes = {
      count: number
      data: Anima.RAW.Episode[]
    } // Returns empty array if no episode | Returns Error if season not found

    type GetUserByID = {
      count: 1,
      data: [Anima.RAW.User]
    } // Returns Error if user not found

    type GetUserPlayerHead = {
      head?: number
      episode_id: number
      user_id: number
    } // Returns Error if user not found or episode not found

    type GetEpisodeMedia = {
      count: number,
      data: Anima.RAW.EpisodeStream
    } // Returns Error if unable to get episode media from source crawler

    type GetCategory = {
      count: 1,
      data: Anima.RAW.Category
    }

    type GetCategories = {
      count: 1,
      data: Anima.RAW.Category[]
    }

    type GetCategoryAnimes = Anima.API.GetAnimes

    type Login = Anima.RAW.User & {
      token: string
    }

    type Validate = Anima.RAW.User & {
      password: undefined,
      iat: number,
      exp: number
    }

    type Register = Anima.RAW.User & {
      token: string
    }
  }
}