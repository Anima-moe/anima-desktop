import { MediaTime } from '@vidstack/react';


type Props = {
  type: 'current' | 'duration' | 'seekable' | 'buffered'
}

function Timestamp({ type }: Props) {
  return (
    <div className='flex h-9 items-center justify-center text-xs'>
       <MediaTime type={type} />
    </div>
  )
}

export default Timestamp