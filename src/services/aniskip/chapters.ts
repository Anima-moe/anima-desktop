import client from '@/services/aniskip/httpService'

export type AniskipInterval = {
  startTime: number
  endTime: number
}
export type AniskipChapter = {
  interval: AniskipInterval
  skipType: 'op' | 'ed' | 'mixed-op' | 'mixed-ed' | 'mixedop' | 'mixeded' | 'recap'
}

export type AniskipReturn = {
  statusCode: number
  message: string
  found: boolean
  results: AniskipChapter[]
}

export const Chapters = {
  async get(malID: number, episode: number, duration: number) {
    const { data } = await client.get(`/${malID}/${episode}`, {
      params: {
        episodeLength: ~~duration,
      },
    })

    return data as AniskipReturn
  },
}
