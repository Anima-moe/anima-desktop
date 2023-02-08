import client from '@/services/anima/httpService'

export const Season = {
  get: async (id: number, locale: string) => {
    const { data } = await client.get(`/season/${id}`, {
      locale
    })
    return data as Anima.API.GetSeasonByID
  },
}