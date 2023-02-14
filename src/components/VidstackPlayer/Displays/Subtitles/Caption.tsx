import React, { memo } from 'react'

import CaptionText from './Text'
import CaptionTime from './Time'

export default memo(function Caption({ start, end = undefined, format, text}: { start: number; end?: number; format: string; text: string }) {
  return (
    <div className="">
        {/* <CaptionTime start={start} end={end} format={format} /> */}
        <CaptionText text={text} />
    </div>
  )
})