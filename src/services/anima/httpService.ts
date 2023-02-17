import axios from 'axios'
import i18next from 'i18next'

export default axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  params: {
    locale: i18next.language,
  },
})
