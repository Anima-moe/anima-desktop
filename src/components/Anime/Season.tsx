import { CaretDown, CaretUp } from 'phosphor-react'
import { useState } from 'react'
import { UnmountClosed } from 'react-collapse';

type Props = {}

function Season({}: Props) {
  const [expanded, setExpanded] = useState(false)
  
  const onToggleExpand = () => {
    setExpanded(!expanded)
  }

  return <>
    <div 
      className={`w-full bg-tertiary hover:bg-accent hover:text-primary duration-300 px-4 py-2 ${ expanded ? 'rounded-t-md' : 'rounded-md'} cursor-pointer font-semibold justify-between flex flex-row  select-none`}
      onClick={onToggleExpand}
      onKeyDown={(e) => {
        if (e.code === 'Enter' || e.code === 'Space') {
          onToggleExpand()
        }
      }}
      role="button"
      tabIndex={0}
    >
      Season 1
      { expanded ? <CaretUp size={24} /> : <CaretDown size={24} /> }
    </div>
    <UnmountClosed  
      isOpened={expanded} 
      theme={{ collapse: 'transition-all duration-300' }} 
    >
      <div className='bg-secondary w-full flex flex-row last-of-type:rounded-b-md'>
        a
      </div>
    </UnmountClosed >
  </>
}

export default Season