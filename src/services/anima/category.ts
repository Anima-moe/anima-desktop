import client from '@/services/anima/httpService'

export const Category = {
  get: async function (id: number) {},

  getBySlug: async function (slug: string) {},

  getAll: async function (locale: string, count?: number, start?: number) {
    const { data } = await client.get('/category', {
      params: {
        count: count ?? 20,
        start: start ?? 0,
        locale: locale,
      },
    })

    return data as Anima.API.GetCategories
  },
}
