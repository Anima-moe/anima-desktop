import React from 'react'

import { getLocaleMetadata } from '@/services/anima/getMetadataFromMedia'

type Props = {
  seasonNumber: number
  episodeNumber: number
  episodeTitle: string
}

function MediaTitle({ episodeNumber, episodeTitle, seasonNumber }: Props) {
  return (
    <p className="flex h-full items-center text-white">
      S{seasonNumber}E{episodeNumber} • {episodeTitle}
    </p>
  )
}

export default MediaTitle
