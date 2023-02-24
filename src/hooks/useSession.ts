import { useState, useEffect } from 'react'

import { User } from '@/services/anima/user'

function useSession() {
  const [session, setSession] = useState<Partial<Anima.RAW.User> & { token: string }>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    ;(async () => {
      const user = await User.getUserData()

      setSession(user)
      setLoading(false)
    })()
  }, [])

  return { session, loading }
}

export default useSession
