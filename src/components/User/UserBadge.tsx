import * as Tooltip from '@radix-ui/react-tooltip'

interface IUserBadgeProps {
  badge: Anima.RAW.Badge
}

const UserBadge: React.FunctionComponent<IUserBadgeProps> = ({badge}) => {
  return <Tooltip.Provider >
      <Tooltip.Root>
        <Tooltip.Trigger asChild className='cursor-pointer'>
          { badge.icon ? (
            <img src={`/badges/${badge.icon}.svg`} className='h-6 w-6' />
          )  : (
            <span className='rounded-md bg-tertiary px-2 py-1 text-xs select-none'>{badge.name}</span>
          ) }
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content className="bg-secondary z-50 flex rounded-md px-4 py-2 items-center" sideOffset={5}>
            { badge.icon ? <>
              <div className='relative w-8 h-8 mr-4'>
                <img src={`/badges/${badge.icon}.svg`} className='h-8 w-8 absolute top-0 left-0' />
                <img src={`/badges/${badge.icon}.svg`} className='h-8 w-8 blur-md  absolute top-0 left-0' />
              </div>
              <div className='flex flex-col'>
                <span className='text-sm'>{badge.name}</span>
                <span className='text-xs text-subtle'>{badge.description}</span>
              </div>
            </> : <>
              <span className='rounded-md bg-tertiary px-2 py-1 text-xs select-none mr-4'>{badge.name}</span>
              <div className='flex flex-col'>
                <span className='text-xs text-subtle'>{badge.description}</span>
              </div>
            </>}
            <Tooltip.Arrow className="fill-secondary" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
}

export default UserBadge