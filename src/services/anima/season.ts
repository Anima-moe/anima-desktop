import client from '@/services/anima/httpService'

export const Season = {
  get: async (id: number, locale: string) => {
    const { data } = await client.get(`/season/${id}`, {})
    return data as Anima.API.GetSeasonByID
  },
}
