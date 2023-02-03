import client from '@/services/anima/httpService'

export const User = {

  get: async function (id: number) {

  },

  login: async function (username: string, password: string) {
    const { data } = await client.post('/auth/signin', {
      username,
      password
    })

    return data as Anima.API.Login
  },

  validate: async function (token: string) {
    const { data } = await client.post('/auth/checkin', {
      token
    })

    return data as Anima.API.Validate
  },

  register: async function (username: string, password: string, email: string) {
    const { data } = await client.post('/auth/signup', {
      username,
      password,
      email
    })

    return data as Anima.API.Register
  },
}