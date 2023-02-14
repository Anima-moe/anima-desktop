import React, { memo } from 'react'

import { Duration } from 'luxon'

export function getFormat(total) {
  const totalDuration = Duration.fromMillis(total)
  const format = 'yy:MM:dd:hh:mm:ss'

  // Lets get our total, but with all our possible values
  const totalFormatted = totalDuration.toFormat(format)
  // We're going to split up our formatted string, strip leading zeros,
  // then get the index of the first section without a zero value
  const firstIndexWithoutZero = totalFormatted
    .split(':')
    .map(value => +value.replace(/^0/))
    .findIndex(numeric => numeric > 0)

  const formatSplit = format.split(':'),
    // Use mm:ss if total is wack
    indexToSplitFrom =
      firstIndexWithoutZero === -1
        ? formatSplit.length - 2
        : firstIndexWithoutZero
  return formatSplit.slice(indexToSplitFrom).join(':')
}

export default memo(function time({ start, end = undefined, format }: {start: number, end?: number, format: string}) {
  const startDuration = Duration.fromMillis(start),
    endDuration = end && Duration.fromMillis(end)
  const startFormatted = startDuration.toFormat(format),
    endFormatted = end && endDuration.toFormat(format)
  return (
    <div className="caption-time">
      {startFormatted}
      {end ? ` - ${endFormatted}` : undefined}
    </div>
  )
})