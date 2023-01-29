import { Store } from "tauri-plugin-store-api"
const store = new Store(".anima.confg")

export async function setConfigValue(key: string, value: any) {
  return await store.set(key, value)
}

export async function getConfigValue<T>(key: string) {
  return await store.get(key) as T
}