import GqlClient from '@/services/animeSkip/animeSkipClient'
import { gql } from '@apollo/client'

export type AnimeSkipResponse = {
  episodeCount: number
  episodes: Episode[]
}

export type Episode = {
  number: string
  season: string
  absoluteNumber: string
  baseDuration: number
  timestamps: EpisodeTimestamp[]
}

export type EpisodeTimestamp = {
  type: {
    name:
      | 'Intro'
      | 'Canon'
      | 'Credits'
      | 'Preview'
      | 'Mixed Credits'
      | 'Unknown'
      | 'Outro'
      | 'Recap'
      | 'Branding'
      | 'Title Card'
      | 'Transition'
      | 'New Intro'
      | 'New Credits'
    description: string
  }
  at: number
}

export const animeSkipService = {
  async getAnimeByName(name: string) {
    if (!name) {
      return
    }
    const query = gql`
      query ($name: String) {
        searchShows(search: $name) {
          episodeCount
          episodes {
            baseDuration
            season
            number
            absoluteNumber
            timestamps {
              type {
                name
                description
                __typename
              }
              at
              __typename
            }
            __typename
          }
          __typename
        }
      }
    `
    try {
      const res = await GqlClient.query({
        query: query,
        variables: {
          name,
        },
      })

      return res.data.searchShows[0] as AnimeSkipResponse
    } catch (e) {
      console.error('Anima failed to retried chapters for this media')
    }
  },
}
