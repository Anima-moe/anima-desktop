import client from '@/services/anima/httpService'

export const Stream = {
  get: async function (id: number, guid: string) {
    const { data } = await client.get(`/episode/${id}/media/${guid}`)

    return data as Anima.API.GetEpisodeMedia
  },
}
