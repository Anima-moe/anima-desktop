import React, { memo } from 'react'

import CaptionText from './Text'

export default memo(function Caption({ text}: {text: string }) {
  return (
    <div className="">
        <CaptionText text={text} />
    </div>
  )
})