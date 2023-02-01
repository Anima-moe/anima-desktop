import { getLocaleMetadata } from '@/services/anima/getMetadataFromMedia'
import React from 'react'

type Props = {
  seasonNumber: number
  episodeNumber: number
  episodeTitle: string
}

function MediaTitle({ episodeNumber, episodeTitle, seasonNumber }: Props) {
  return <p className='text-white text-opacity-70'>
  S{seasonNumber}E{episodeNumber} • {episodeTitle}
</p>
}

export default MediaTitle