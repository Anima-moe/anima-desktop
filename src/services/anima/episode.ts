import client from '@/services/anima/httpService'

export const Episode = {

  get: async function (id: number) {
    const { data } = await client.get(`/episode/${id}`)

    return data as Anima.API.GetEpisodeByID
  },

  getStreams: async function (id: number, locale) {
    const { data } = await client.get(`/episode/${id}/media`, {
      params: {
        locale
      }
    })

    return data as Anima.API.GetEpisodeMedia
  }
}