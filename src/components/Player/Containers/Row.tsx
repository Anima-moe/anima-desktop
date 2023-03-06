import clsx from 'clsx'

interface IPlayerControlsRowProps {
  children: React.ReactNode | React.ReactNode[]
  top?: boolean
  bottom?: boolean
}

const PlayerControlsRow: React.FunctionComponent<IPlayerControlsRowProps> = ({ top, bottom, children}) => {
  const positionClasses = clsx({
    'min-h-[10px] flex w-full gap-2 whitespace-nowrap pointer-events-none duration-200 transition-all relative items-center': true,
    'media-user-idle:-translate-y-[200%]': top,
    'media-user-idle:translate-y-[200%] not-media-can-play:hidden': bottom,
  })
  return <div className={positionClasses}>
    {children}
  </div>
}

export default PlayerControlsRow
