import { MediaTimeSlider } from '@vidstack/react';


type Props = {}

function Slider({}: Props) {
  return <div className='w-full pointer-events-auto mx-4 h-9 flex items-center relative'>
    <MediaTimeSlider>
      {/* <div slot="preview">
        <div className='overflow-hidden rounded-md'>
          <SliderVideo src="https://media-files.vidstack.io/240p.mp4" />
        </div>
        <SliderValueText type="pointer" format="time" />
      </div> */}
    </MediaTimeSlider>
  </div>
  
}

export default Slider