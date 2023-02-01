import client from '@/services/anima/httpService'

export const Episode = {

  get: async function (id: number) {
    const { data } = await client.get(`/episode/${id}`)

    return data as Anima.API.GetEpisodeByID
  },

  getStreams: async function (id: number, locale) {
    console.log("Trying to fetch streams for episode", id, locale)
    console.log(`/episode/${id}/media`)

    const { data } = await client.get(`/episode/${id}/media`, {
      params: {
        locale
      }
    })

    return data as Anima.API.GetEpisodeMedia
  }
}