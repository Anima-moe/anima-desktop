namespace Anima {
  namespace ENUM {
    enum Premium {
      FREE = 0,
      DONATOR = 1,
      LORD = 2,
      GOD = 3,
    }

    enum Source {
      CRUNCHYROLL = 1,
    }
  }
  namespace RAW {
    type Locales = 'en-US' | 'pt-BR' | 'es-419' | 'de-DE' | 'ja-JP' | 'pt-PT'

    type Comment = {
      id: number
      user_id: number
      parent_id?: number
      episode_id: number
      comment: string
      Children?: Anima.RAW.Comment[]
      created_at: string
      updated_at: string
      User: Anima.RAW.User
    }

    type CategoryMetadata = {
      title: string
      description: string
      category_id: number
      locale_key: Locales
    }

    type Category = {
      id: number
      slug: string
      locale: string
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
      updated_at: string
      created_at: string
    }

    type StreamObject = {
      [key: string]: {
        original: boolean
        external_id: string
      }
    }

    type SubtitleObject = {
      [key: string]: {
        format: string
        locale: Locales
        url: string
      }
    }

    type EpisodeStream = {
      source: Anima.ENUM.Source
      hls: string
      hls_subtitled: string
      mp4: { src: string; height: number }[]
      subtitles: SubtitleObject
      bif: string
      audios: StreamObject
    }

    type Badge = {
      id: number
      name: string
      description: string
      icon: string
      level: number
    }

    type UserProfile = {
      id: number
      user_id: number
      avatar?: string
      banner?: string
      bio?: string
      background?: string
      color?: string
      border?: string
      Badge?: Anima.RAW.Badge[]
      badge?: Anima.RAW.Badge[]
    }

    type UserPlayerHead = {
      id: number
      head: number
      episode_id: number
      user_id: number
      AnimeEpisode: Anima.RAW.Episode & {
        AnimeSeason: Anima.RAW.Season & {
          Anime: Anima.RAW.Anime & {
            AnimeMetadata: Anima.RAW.AnimeMetadata[]
          }
        }
      }
      created_at: string
      updated_at: string
      duration: number
    }

    type User = {
      id: number
      username: string
      email?: string
      staff: boolean
      iat?: number
      exp?: number
      premium: number
      profile?: Anima.RAW.UserProfile // TODO:
      UserProfile?: Anima.RAW.UserProfile // This needs to bne fixed.
      UserPlayerHead?: Anima.RAW.UserPlayerHead[]
      _count?: {
        Comment?: number
        UserPlayerHead?: number
      }
    }
  }

  namespace API {
    type DefaultResponse<T> = {
      count: number
      data: T[]
    }

    type Error = {
      error: true
      message: string
    }

    type SearchAnimes = DefaultResponse<RAW.Anime> // Returns empty array if none found
    type SearchUser = DefaultResponse<RAW.User> // Returns empty array if none found

    type GetAnimeByID = {
      counter: 1
      data: Anima.RAW.Anime
    } // Returns Error if anime not found

    type GetAnimes = DefaultResponse<Anima.RAW.Anime> // Returns empty array if not found

    type GetAnimeSeasons = DefaultResponse<Anima.RAW.Season> // Returns empty array if no season | Returns Error if anime not found

    type GetEpisodeByID = {
      count: 1
      data: Anima.RAW.Episode
    } // Returns Error if episode not found

    type GetSeasonByID = {
      count: 1
      data: [Anima.RAW.Season]
    } // Returns Error if season not found

    type GetSeasonEpisodes = DefaultResponse<Anima.RAW.Episode> // Returns empty array if no episode | Returns Error if season not found

    type GetUserByID = {
      count: 1
      data: [Anima.RAW.User]
    } // Returns Error if user not found

    type GetEpisodePlayerHead = {
      count: number
      data: Anima.RAW.UserPlayerHead
    }

    type GetUserPlayerHead = {
      count: number
      data: Anima.RAW.UserPlayerHead[]
    } // Returns Error if user not found or episode not found

    type GetUserComments = DefaultResponse<
      Anima.RAW.Comment & { AnimeEpisode: Anima.RAW.Episode & { AnimeSeason: Anima.RAW.Season & { Anime: Anima.RAW.Anime } } }
    >

    type GetEpisodeMedia = {
      count: number
      data: Anima.RAW.EpisodeStream
    } // Returns Error if unable to get episode media from source crawler

    type GetCategory = {
      count: 1
      data: Anima.RAW.Category
    }

    type GetCategories = {
      count: 1
      data: Anima.RAW.Category[]
    }

    type GetCategoryAnimes = Anima.API.GetAnimes

    type GetUser = Anima.RAW.User

    type Login = Anima.RAW.User & {
      token: string
    }

    type Validate = Anima.RAW.User & {
      password: undefined
      iat: number
      exp: number
    }

    type Register = Anima.RAW.User & {
      token: string
    }

    type GetComments = {
      count: number
      data: Anima.RAW.Comment[]
    }

    type GetLatestEpisodes = {
      count: number
      data: Anima.RAW.Episode[]
    }

    type GetUserLikedUsers = DefaultResponse<Anima.RAW.User>
  }

  namespace TARDIS {
    type Participant = {
      id: number
      authorized: boolean
      payload: Pick<Anima.RAW.User, 'avatar' | 'staff' | 'premium' | 'id' | 'profile' | 'username'>
    }

    type Room = {
      id: number
      episodeID: number
      name: string
      private: boolean
      participants: Participant[]
      leader: number
      messages?: Message[]
    }

    type Message = {
      content: string
      author: Participant
    }

    type IN =
      | {
          event: 'chatMessage'
          data: {
            message: string
            author: Tardis.RAW.User
            timestamp: string
          }
        }
      | {
          event: 'createRoom'
          data: {
            episodeID: number
            name: string
            private: boolean
          }
        }
      | {
          event: 'getRooms'
        }
      | {
          event: 'joinRoom'
          data: {
            roomID: number
          }
        }
      | {
          event: 'leaveRoom'
        }
      | {
          event: 'requestPlay'
          data: {
            currentTime: number
          }
        }
      | {
          event: 'requestPause'
          data: {
            currentTime: number
          }
        }
      | {
          event: 'requestSeek'
          data: {
            currentTime: number
          }
        }
      | {
          event: 'requestStop'
        }
      | {
          event: 'requestSourceChange'
          data: {
            episodeID: number
          }
        }
      | {
          event: 'authorize'
          data: {
            id: number
            authorized: boolean
            payload: Partial<Anima.RAW.User> & {
              exp: number
              iat: number
            }
          }
        }
  }
}
