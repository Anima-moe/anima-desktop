import { Store } from "tauri-plugin-store-api"
import axiosTauriApiAdapter from 'axios-tauri-api-adapter'

import axios from 'axios'
// @ts-ignore
const client = axios.create({ adapter: axiosTauriApiAdapter, baseURL: 'https://anima.moe' })


