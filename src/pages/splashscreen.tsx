import { useState } from 'react'
import { useEffect } from 'react'

import dayjs from 'dayjs'
import { AnimatePresence } from 'framer-motion'
import { useAtom } from 'jotai'

import Login from '@/components/splashscreen/Login'
import Register from '@/components/splashscreen/Register'
import Welcome from '@/components/splashscreen/Welcome'
import { User } from '@/services/anima/user'
import { splashScreenPageAtom, splashScreenPagePropsAtom, userToken } from '@/stores/atoms'
import { relaunch } from '@tauri-apps/api/process'

const pages = {
  welcome: Welcome,
  login: Login,
  register: Register,
}

const timedPromise = async (promFac: () => Promise<any>) => {
  const start = performance.now()
  const returnValue = await promFac()
  return {
    value: returnValue,
    elapsed: performance.now() - start,
  }
}


function SplashScreen() {
  const [pageProps, setPageProps] = useAtom(splashScreenPagePropsAtom)
  const [currentPage, setCurrentPage] = useAtom(splashScreenPageAtom)
  const [storedToken] = useAtom(userToken)
  const Element = pages[currentPage]

  const ensureUserToken = async () => {
    try {
      if (!storedToken || storedToken.trim() == '') {
        return false
      }
  
      const data = await User.validate(storedToken)
  
      return dayjs().isBefore(dayjs.unix(data.exp).subtract(1, 'day'))
    } catch (e) {
      return false
    }
  }

  useEffect(() => {
    ;(async () => {
      try {
        const { checkUpdate, installUpdate } = await import('@tauri-apps/api/updater')
        const { shouldUpdate } = await checkUpdate()
        if (shouldUpdate) {
          await installUpdate()
          return relaunch()
        }
      } catch (e) {}

      const { value: userHasToken, elapsed } = await timedPromise(ensureUserToken)
      setTimeout(
        async () => {
          if (!userHasToken) {
            setCurrentPage('login')
          } else {
            const { createMainWindow } = await import('@/services/tauri/windows')
            createMainWindow()
          }
        },
        elapsed > 2000 ? 0 : 2000 - elapsed
      )
    })()
  }, [])
  return (
    <AnimatePresence initial mode="wait">
      <Element key={currentPage} {...pageProps} />
      <style>{'body { background: transparent }'}</style>
    </AnimatePresence>
  )
}

export default SplashScreen
