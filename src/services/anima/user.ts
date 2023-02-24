import client from '@/services/anima/httpService'

export const User = {
  getUserData: async function () {
    const { getConfigValue } = await import('@/services/tauri/configValue')
    const token = (await getConfigValue('token')) as string
    if (!token) {
      return
    }

    const decodedToken = atob(token.split('.')[1])

    return { ...JSON.parse(decodedToken), token } as Partial<Anima.RAW.User> & { token: string }
  },

  get: async function (id: number) {
    const storeapi = await import('tauri-plugin-store-api')
    const { getConfigValue } = await import('@/services/tauri/configValue')
    const token = await getConfigValue('token')

    const { data } = await client.get(`/user/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    return data.data as Anima.API.GetUser
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

  isLogged: async function () {
    const { getConfigValue } = await import('@/services/tauri/configValue')
    const token = (await getConfigValue('token')) as string

    if (!token || token.trim() === '') return false
    return true
  },

  getMyPlayerHeads: async function () {
    const userData = await User.getUserData()
    const { data } = await client.get(`/user/${userData.id}/playerhead`, {})

    return data as Anima.API.GetUserPlayerHead
  },

  getPlayerHeads: async function (userId: number) {
    const { data } = await client.get(`/user/${userId}/playerhead`, {})

    return data as Anima.API.GetUserPlayerHead
  },

  getMyEpisodePlayerHead: async function (episodeId: number) {
    const userData = await User.getUserData()
    if (!userData || !userData.id) return
    const { data } = await client.get(`/user/${userData.id}/playerhead/${episodeId}`, {})

    return data as Anima.API.GetEpisodePlayerHead
  },

  getEpisodePlayerHead: async function (userId: number, episodeId: number) {
    const { data } = await client.get(`/user/${userId}/playerhead/${episodeId}`, {})

    return data as Anima.API.GetUserPlayerHead
  },

  postEpisodePlayerHead: async function (episodeId: number, duration: number, head: number) {
    const userData = await User.getUserData()
    if (!userData || !userData.id) return

    const { data } = await client.post(
      `/user/${userData.id}/playerhead`,
      {
        duration,
        head,
        episode_id: episodeId,
      },
      {
        headers: {
          Authorization: `Bearer ${userData.token}`,
        },
      }
    )

    return
  },
}
