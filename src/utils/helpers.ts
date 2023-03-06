import { BIFParser } from './bif'

export function clamp(num: number, min: number, max) {
  return num <= min ? min : num >= max ? max : num
}

export function fetchBifFromURL(url: string): Promise<BIFParser> {
  return new Promise((resolve, reject) => {
    const request = new XMLHttpRequest()
    request.responseType = 'arraybuffer'

    request.onload = () => {
      const bif = new BIFParser(request.response)
      resolve(bif)
    }

    request.onerror = () => {
      reject(new Error('Error fetching BIF'))
    }

    request.open('GET', url)

    request.send()
  })
}
