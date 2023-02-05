import { MediaTime, useMediaStore } from '@vidstack/react';


type Props = {
  type: 'current' | 'duration' | 'seekable' | 'buffered'
}

function Timestamp({ type }: Props) {
  const { currentTime,  } = useMediaStore()
  return (
    <div className='flex h-4 items-center justify-center'>
       <MediaTime type={type} style={{ fontSize: '.9rem'}} />
    </div>
  )
}

export default Timestamp