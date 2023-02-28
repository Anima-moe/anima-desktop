import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { ToastContentProps, toast } from 'react-toastify'

import dayjs from 'dayjs'
import { AnimatePresence } from 'framer-motion'
import { useAtom } from 'jotai'

import Login from '@/components/splashscreen/Login'
import Register from '@/components/splashscreen/Register'
import Welcome from '@/components/splashscreen/Welcome'
import { User } from '@/services/anima/user'
import { splashScreenPageAtom, splashScreenPagePropsAtom, userToken } from '@/stores/atoms'

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
  const { t } = useTranslation()

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
    const start = async () => {
      async function init() {
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
      }

      try {
        const { checkUpdate } = await import('@tauri-apps/api/updater')
        const { shouldUpdate } = await checkUpdate()
        if (shouldUpdate) {
          toast(<UpdaterToast />, {
            autoClose: false,
            closeOnClick: false,
            closeButton: false,
            onClose: () => {
              init()
            },
          })
          return
        }
      } catch {}

      init()
    }

    start()
  }, [])

  const UpdaterToast = ({ closeToast }: Partial<ToastContentProps>) => {
    const handleRefuse = () => closeToast()

    const handleDownload = async () => {
      closeToast()

      const { installUpdate } = await import('@tauri-apps/api/updater')

      await toast.promise(installUpdate(), {
        pending: t('splash_downloading_pending'),
        success: t('splash_downloading_success'),
        error: t('splash_downloading_error'),
      })

      const { relaunch } = await import('@tauri-apps/api/process')
      await relaunch()
    }

    return (
      <div className="flex h-full w-full flex-col items-center justify-center space-y-3">
        {t('splash_version')}
        <div className="flex w-full justify-evenly">
          <button className="px-3 py-1" onClick={handleRefuse}>
            {t('splash_version_refuse')}
          </button>
          <button
            className="rounded-lg bg-accent px-3 py-1 text-primary hover:bg-black hover:text-accent"
            onClick={handleDownload}
          >
            {t('splash_version_accept')}
          </button>
        </div>
      </div>
    )
  }

  return (
    <AnimatePresence initial mode="wait">
      <Element key={currentPage} {...pageProps} />
      <style>{'body { background: transparent }'}</style>
    </AnimatePresence>
  )
}

export default SplashScreen
