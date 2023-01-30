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
    }

    type Anime = {
      id: number
      cover: string
      background: string
      slug: string
      external_id: string
      seasons: Season[]
      AnimeMetadata: Anima.RAW.AnimeMetadata[]
    }

    type Episode = {
      id: number
      number: number
      season_id: number
      source_id: number
      EpisodeMetadata: EpisodeMetadata[]
      source: EpisodeSource[]
    }

    type EpisodeMedia = {
      hls_hardsub?: string
      hls_softsub?: string
      subtitles: {
        [key: string]: {
          ass?: string,
          srt?: string
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
      data: Anima.RAW.Anime[]
    } | Error // Returns Error if anime not found

    type GetAnimes = {
      count: number
      data: Anima.RAW.Anime[]
    } // Returns empty array if not found

    type GetAnimeSeasons = {
      count: number
      data: Anima.RAW.Season[]
    } | Error // Returns empty array if no season | Returns Error if anime not found

    type GetEpisodeByID = {
      count: 1
      data: [Anima.RAW.Episode]
    } | Error // Returns Error if episode not found

    type GetSeasonByID = {
      count: 1
      data: [Anima.RAW.Season]
    } | Error // Returns Error if season not found

    type GetSeasonEpisodes = {
      count: number
      data: Anima.RAW.Episode[]
    } | Error // Returns empty array if no episode | Returns Error if season not found

    type GetUserByID = {
      count: 1,
      data: [Anima.RAW.User]
    } | Error // Returns Error if user not found

    type GetUserPlayerHead = {
      head?: number
      episode_id: number
      user_id: number
    } | Error // Returns Error if user not found or episode not found

    type GetEpisodeMedia = {
      count: 1,
      data: [Anima.RAW.EpisodeMedia]
    } | Error // Returns Error if unable to get episode media from source crawler

    type GetCategory = {

    }

    type GetCategoryAnimes = Anima.API.GetAnimes
  }
}