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
  return (
    <div className="pointer-events-auto relative flex w-full items-center">
      <MediaTimeSlider className="group h-2 overflow-hidden rounded-sm">
        {/* BACKGROUND */}
        <div
          className="absolute top-1/2 h-5 w-full origin-left -translate-y-1/2 bg-white bg-opacity-10 transition-[height] duration-300 group-hover:h-4"
          slot="track"
        />
        {/* BUFFER */}
        <div
          className="absolute top-1/2 h-5 w-full origin-left -translate-y-1/2 scale-x-[calc(var(--media-buffered-amount)/var(--media-duration))] bg-white bg-opacity-20 transition-[height] duration-300 group-hover:h-4"
          slot="track track-progress"
        />
        {/* PROGRESS */}
        <div
          className="absolute top-1/2 h-5 w-[var(--slider-fill-percent)] origin-left -translate-y-1/2 bg-accent transition-[height] duration-300 group-hover:h-4"
          slot="track track-fill"
        />
      </MediaTimeSlider>
    </div>
  )
}

export default Slider
