import { useEffect } from 'react'

import {
  isRegistered,
  register,
  ShortcutHandler,
  unregister,
} from '@tauri-apps/api/globalShortcut'

/**
 * @param shortcut The key combination string for the shortcut
 * @param shortcutHandler The handler callback when the shortcut is triggered
 */
export const useGlobalShortcut = (
  shortcut: string,
  shortcutHandler: ShortcutHandler,
) => {
  useEffect(() => {
    let ignore = false

    async function registerShortcut() {
      const isShortcutRegistered = await isRegistered(shortcut)
      if (!ignore && !isShortcutRegistered) {
        await register(shortcut, shortcutHandler)
      }
    }

    void registerShortcut().catch((err) =>
      console.error(`Failed to register global shortcut '${shortcut}'`, err),
    )

    return () => {
      ignore = true
      void unregister(shortcut)
    }
  }, [shortcut, shortcutHandler])
}