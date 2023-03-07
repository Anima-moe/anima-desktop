import client from '@/services/anima/httpService'

import { User } from './user'

export const Episode = {
  get: async function (id: number) {
    const { data } = await client.get(`/episode/${id}`)

    return data as Anima.API.GetEpisodeByID
  },

  getStreams: async function (id: number) {
    const { data } = await client.get(`/episode/${id}/media`)

    return data as Anima.API.GetEpisodeMedia
  },

  createComment: async function (id: number, comment: string, parent?: number) {
    const userData = await User.getUserData()
    if (!userData.id || !userData.token) {
      return
    }

    await client.post(
      `/episode/${id}/comment`,
      {
        comment,
        parent_id: parent,
      },
      {
        headers: {
          Authorization: `Bearer ${userData.token}`,
        },
      }
    )
  },

  getComments: async function (id: number, start = 0, count = 10) {
    const { data } = await client.get(`/episode/${id}/comment`, {
      params: {
        start,
        count,
      },
    })

    return data as Anima.API.GetComments
  },
}
