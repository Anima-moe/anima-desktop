import client from '@/services/anima/httpService'

export const User = {
  get: async function (id: number) {
    const storeapi = await import('tauri-plugin-store-api')
    const { getConfigValue } = await import('@/services/tauri/configValue')
    const token = await getConfigValue('token')

    const { data } = await client.get(`/user/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    return data as Anima.API.GetUser
  },

  login: async function (username: string, password: string) {
    const { data } = await client.post('/auth/signin', {
      username,
      password,
    })

    return data as Anima.API.Login
  },

  validate: async function (token: string) {
    const { data } = await client.post('/auth/checkin', {
      token,
    })

    return data as Anima.API.Validate
  },

  register: async function (username: string, password: string, email: string) {
    const { data } = await client.post('/auth/signup', {
      username,
      password,
      email,
    })

    return data as Anima.API.Register
  },

  me: async function () {
    const { getConfigValue } = await import('@/services/tauri/configValue')
    const token = await getConfigValue('token')
    const { data } = await client.get('/user/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    return data as Anima.API.GetUser
  },

  update: async function (data: unknown) {
    const { getConfigValue } = await import('@/services/tauri/configValue')
    const token = await getConfigValue('token')

    const response = await client.post('/user/update', data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    return response.data as Anima.API.GetUser
  },
}
