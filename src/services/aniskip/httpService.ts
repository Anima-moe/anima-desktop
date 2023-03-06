import axios from 'axios'
import i18next from 'i18next'

export default axios.create({
  baseURL: 'https://api.aniskip.com/v2/skip-times',
  headers: {
    'Content-Type': 'application/json',
  },
  params: {
    types: ['op', 'ed', 'mixed-op', 'mixed-ed', 'recap'],
  },
  paramsSerializer: {
    indexes: null,
  },
})
