import axios from 'axios'
import axiosTauriApiAdapter from 'axios-tauri-api-adapter'
// @ts-ignore
const client = axios.create({ adapter: axiosTauriApiAdapter })