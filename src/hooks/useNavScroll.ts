import { useEffect, useState } from 'react'

export default function useNavScroll() {
  const [immersive, setImmersion] = useState(true)


  useEffect(() => {
    const content = document.getElementById('content')
    if (!content) { return }
    const scrollListener = () => {
      if (content.scrollTop > 60 && immersive) {
        setImmersion(false)
      } else {
        setImmersion(true)
      }
    }

    content.addEventListener('scroll', scrollListener)

    return () => {
      content.removeEventListener('scroll', scrollListener)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return immersive
}