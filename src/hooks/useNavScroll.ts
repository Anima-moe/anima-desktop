import { useEffect, useState } from 'react'

export default function useNavScroll() {
  const [blackHeader, setBlackHeader] = useState(false)

  useEffect(() => {
    const generalContainer = document.getElementById('animacontent') as HTMLDivElement

    if (!generalContainer) return

    const scrollListener = () => {
      if (generalContainer.scrollTop > 60) {
        setBlackHeader(true)
      } else {
        setBlackHeader(false)
      }
    }

    generalContainer.addEventListener('scroll', scrollListener)

    return () => {
      generalContainer.removeEventListener('scroll', scrollListener)
    }
  }, [])

  return blackHeader
}
