import { useEffect } from 'react'
import { ToastContentProps, toast } from 'react-toastify'

import dayjs from 'dayjs'
import { AnimatePresence } from 'framer-motion'
import { useAtom } from 'jotai'

import Login from '@/components/splashscreen/Login'
import Register from '@/components/splashscreen/Register'
import Welcome from '@/components/splashscreen/Welcome'
import { User } from '@/services/anima/user'
import { splashScreenPageAtom, splashScreenPagePropsAtom } from '@/stores/atoms'

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

const ensureUserToken = async () => {
  try {
    const { getConfigValue, setConfigValue } = await import('@/services/tauri/configValue')
    const userToken = (await getConfigValue('token')) as string
    if (!userToken || userToken.trim() == '') {
      return false
    }

    const data = await User.validate(userToken)

    return dayjs().isBefore(dayjs.unix(data.exp).subtract(1, 'day'))
  } catch (e) {
    return false
  }
}

function SplashScreen() {
  const [pageProps, setPageProps] = useAtom(splashScreenPagePropsAtom)
  const [currentPage, setCurrentPage] = useAtom(splashScreenPageAtom)
  const Element = pages[currentPage]

  useEffect(() => {
    const start = async () => {
      try {
        const { checkUpdate } = await import('@tauri-apps/api/updater')
        const { shouldUpdate } = await checkUpdate()
        if (shouldUpdate) {
          toast(<UpdaterToast />, {
            autoClose: false,
            closeOnClick: false,
            closeButton: false,
          })
        }
      } catch {}

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
    start()
  }, [])

  const UpdaterToast = ({ closeToast }: Partial<ToastContentProps>) => {
    const handleRefuse = () => closeToast()

    const handleDownload = async () => {
      closeToast()

      const { installUpdate } = await import('@tauri-apps/api/updater')

      await toast.promise(installUpdate(), {
        pending: 'downloading porra',
        success: 'download completed',
        error: 'downaload errorr',
      })

      toast(<RestartToast />, {
        autoClose: false,
        closeOnClick: false,
        closeButton: false,
      })
    }

    return (
      <div className="flex h-full w-full flex-col items-center justify-center space-y-2">
        New version available, download
        <div className="flex w-full justify-evenly">
          <button className="px-3 py-1" onClick={handleRefuse}>
            Not now
          </button>
          <button
            className="rounded-lg bg-accent px-3 py-1 text-primary hover:bg-black hover:text-accent"
            onClick={handleDownload}
          >
            Download
          </button>
        </div>
      </div>
    )
  }

  const RestartToast = ({ closeToast }: Partial<ToastContentProps>) => {
    const handleRefuse = () => closeToast()

    const handleRestart = async () => {
      const { relaunch } = await import('@tauri-apps/api/process')
      await relaunch()
    }

    return (
      <div className="flex h-full w-full flex-col items-center justify-center space-y-2">
        Download completed restart to install
        <div className="flex w-full justify-evenly">
          <button className="px-3 py-1" onClick={handleRefuse}>
            Not now
          </button>
          <button
            className="rounded-lg bg-accent px-3 py-1 text-primary hover:bg-black hover:text-accent"
            onClick={handleRestart}
          >
            Download
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
