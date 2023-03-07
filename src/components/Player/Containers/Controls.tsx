interface IPlayerControlsProps {
  children: React.ReactNode | React.ReactNode[]
}

const PlayerControls: React.FunctionComponent<IPlayerControlsProps> = (props) => {
  return <div 
    className='absolute top-0 left-0 w-full h-full flex justify-between flex-col z-[2] media-user-idle:cursor-none overflow-hidden not-media-can-play:bg-primary/60 not-media-user-idle:bg-primary/40 duration-300 media-buffering:bg-primary/40 media-paused:!bg-primary/60 p-2 media-user-idle:bg-transparent items-center'
    >
    {props.children}
  </div>
}

export default PlayerControls
