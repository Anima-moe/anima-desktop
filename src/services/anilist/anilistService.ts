import GqlClient from '@/services/anilist/anilistClient'
import { gql } from '@apollo/client'

export type AnilistStaff = {
  name: {
    full: string
    native: string
  }
  image: {
    large: string
  }
  primaryOccupations: string
}

export type AnilistStudio = {
  name: string
  isAnimationStudio: boolean
}

export type AnilistCharacter = {
  voiceActors: AnilistVoiceActor[]
  node: {
    id: number
    image: {
      large: string
    }
    name: {
      full: string
      native: string
    }
  }
}

export type AnilistVoiceActor = {
  languageV2: string
  image: {
    large: string
  }
  name: {
    full: string
    native: string
  }
}

export type AnilistMedia = {
  bannerImage?: string
  id: number
  idMal?: number
  isAdult: boolean
  status: string
  startDate: {
    year: number
    month: number
    day: number
  }
  characters: {
    edges: AnilistCharacter[]
  }
  nextAiringEpisode?: {
    episode: number
    timeUntilAiring: number
  }
  synonyms: string[]
  title: {
    native: string
  }
  trailer: {
    site: string
    id: string
  }
  averageScore: number
  meanScore: number
  studios: {
    nodes: AnilistStudio[]
  }
  endDate: {
    year: number
    month: number
    day: number
  }
  staff: {
    nodes: AnilistStaff[]
  }
}

export const anilistService = {
  async getAnimeByName(name: string) {
    const query = gql`
      query ($name: String) {
        Media(search: $name, type: ANIME) {
          id
          idMal
          title {
            native
          }
          status
          isAdult
          trailer {
            site
            id
          }
          bannerImage
          synonyms
          characters {
            edges {
              voiceActors {
                id
                languageV2
                name {
                  full
                  native
                }
                image {
                  large
                }
              }
              node {
                id
                image {
                  large
                }
                name {
                  full
                  native
                }
              }
            }
          }
          averageScore
          meanScore
          studios {
            nodes {
              name
              isAnimationStudio
            }
          }
          endDate {
            day
            month
            year
          }
          nextAiringEpisode {
            episode
            timeUntilAiring
          }
          startDate {
            year
            month
            day
          }
          staff {
            nodes {
              name {
                full
                native
              }
              image {
                large
              }
              primaryOccupations
            }
          }
        }
      }
    `
    const res = await GqlClient.query({
      query: query,
      variables: {
        name,
      },
    })

    return res.data.Media as AnilistMedia
  },

  async getMALIDFromName(name: string) {
    if (!name) {
      return
    }
    const query = gql`
      query ($name: String) {
        Media(search: $name, type: ANIME) {
          id
          idMal
        }
      }
    `

    const res = await GqlClient.query({
      query: query,
      variables: {
        name,
      },
    })

    return res.data.Media as Partial<AnilistMedia>
  },
}
