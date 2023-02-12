import { useEffect, useState } from 'react'
export default function useNavScroll() {
  const [blackHeader, setBlackHeader] = useState(false)

  useEffect(() => {
    const scrollListener = () => {
      if (window.scrollY > 60) {
        setBlackHeader(true)
      } else {
        setBlackHeader(false)
      }
    }

    window.addEventListener('scroll', scrollListener)

    return () => {
      window.removeEventListener('scroll', scrollListener)
    }
  }, [])

  return blackHeader
}