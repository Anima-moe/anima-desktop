import { MediaTimeSlider, MediaSliderVideo, MediaSliderValueText } from '@vidstack/react'

type Props = {}

// --slider-fill-rate: 0.511212;
// --slider-fill-value: 725.9;
// --slider-fill-percent: 51.1212%;
// --slider-pointer-rate: 0.881011;
// --slider-pointer-value: 1251;
// --slider-pointer-percent: 88.1011%;

// z-index: 1;
// background-color: #878787;
// transform-origin: left center;
// will-change: transform;
// transform: translateY(-50%) scaleX(calc(var(--media-buffered-amount) / var(--media-duration)));
function Slider({}: Props) {
  return <div className='w-full pointer-events-auto items-center relative px-3  flex'>
    <MediaTimeSlider className='group h-5 rounded-md overflow-hidden'>
      {/* BACKGROUND */}
      <div className='absolute top-1/2 -translate-y-1/2 origin-left w-full h-5 group-hover:h-4 transition-[height] duration-300 bg-white bg-opacity-10' slot='track' />
      {/* BUFFER */}
      <div className='absolute top-1/2 -translate-y-1/2 origin-left w-full scale-x-[calc(var(--media-buffered-amount)/var(--media-duration))] h-5 group-hover:h-4 transition-[height] duration-300 bg-white bg-opacity-20' slot='track track-progress' />
      {/* PROGRESS */}
      <div className='absolute top-1/2 -translate-y-1/2 origin-left w-[var(--slider-fill-percent)] h-5 group-hover:h-4 transition-[height] duration-300 bg-accent' slot='track track-fill' />
    </MediaTimeSlider>
  </div>
  
}

export default Slider