import { MediaTime } from '@vidstack/react'

type Props = {
  type: 'current' | 'duration' | 'buffered'
}

function Timestamp({ type }: Props) {
  return (
    <div className="flex h-4 items-center justify-center text-xs">
      <MediaTime type={type} style={{ fontSize: '.9rem' }} />
    </div>
  )
}

export default Timestamp
