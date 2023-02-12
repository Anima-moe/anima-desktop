// @ts-check

/**
 * For Shaka typescript checking, I have to manually modify d.ts file from shaka-player in node_modules,
 * adding 'export default shaka;' to the end of the file
 * node_modules/shaka-player/dist/shaka-player.compiled.d.ts
 * */
// import { shaka } from 'shaka-player/dist/shaka-player.compiled'
import { useEffect, useRef } from 'react'

import shaka from 'shaka-player'


/** @param {string} manifestUri */
export function useShaka(manifestUri) {

  /** @type {React.MutableRefObject<HTMLMediaElement | null>} */
  const videoRef = useRef(null)

  /** @type {React.MutableRefObject<shaka.Player | null>} */
  const playerRef = useRef(null)

  useEffect(() => {
    function initApp() {
      // Install built-in polyfills to patch browser incompatibilities.
      shaka.polyfill.installAll()
      // Check to see if the browser supports the basic APIs Shaka needs.
      if (shaka.Player.isBrowserSupported()) {
        // Everything looks good!
        initPlayer()
      } else {
        // This browser does not have the minimum set of APIs we need.
        console.error('Browser not supported!')
      }
    }

    async function initPlayer() {
      // Create a Player instance.
      playerRef.current = new shaka.Player(videoRef.current)
      // Attach player to the window to make it easy to access in the JS console.
      // @ts-ignore
      window.player = playerRef.current
      // Listen for error events.
      playerRef.current.addEventListener('error', onErrorEvent)
      // Try to load a manifest.
      // This is an asynchronous process.
      try {
        await playerRef.current.load(manifestUri)
        // This runs if the asynchronous load is successful.
        console.log('The video has now been loaded!')
      } catch (e) {
        // onError is executed if the asynchronous load fails.
        onError(e)
      }
    }

    function onErrorEvent(event) {
      // Extract the shaka.util.Error object from the event.
      onError(event.detail)
    }

    function onError(error) {
      // Log the error.
      console.error('Error code', error.code, 'object', error)
    }

    initApp()

    return () => {
      if (playerRef.current) {
        playerRef.current.removeEventListener('error', onErrorEvent)
        playerRef.current.destroy()
      }
    }

  }, [manifestUri])

  return { videoRef }
}
