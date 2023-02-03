import { ArrowCounterClockwise, ArrowElbowUpRight, ArrowClockwise } from 'phosphor-react';

type Props = {
  forward?: boolean
  backward?: boolean
  time: number
}

function PlayButton({ backward, forward, time }: Props) {
  return <div className='flex items-center justify-center cursor-pointer group pointer-events-auto'>
    { backward && <ArrowCounterClockwise weight='fill' className='w-9 h-9 mr-3 ml-1.5 opacity-50 group-hover:opacity-100 duration-300 order-2'/> }
    { !forward && !backward && <ArrowElbowUpRight weight='fill' className='w-9 h-9 ml-3 opacity-50 group-hover:opacity-100 duration-300'/>}
    { forward && <ArrowClockwise weight='fill' className='w-9 h-9 ml-3 mr-1.5 opacity-50 group-hover:opacity-100 duration-300'/> }
    <span className='text-sm mt-1 text-opacity-50 text-white group-hover:text-opacity-100 duration-300'>{time}</span>
  </div>
}

export default PlayButton