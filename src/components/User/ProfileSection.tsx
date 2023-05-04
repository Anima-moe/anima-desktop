import clsx from 'clsx' 

interface IUserProfileSectionProps {
  className?: string
  contentClassName?: string
  title: string
  children?: React.ReactNode | React.ReactNode[] | JSX.Element | JSX.Element[]
  overlayColor?: string
}

const UserProfileSection: React.FunctionComponent<IUserProfileSectionProps> = ({ className, contentClassName, title, children, overlayColor }) => {
  const classNames = clsx({ 
    [className || '']: true , 
    ' w-full': true 
  })
  const contentClassNames = clsx({
    ' p-4 bg-secondary rounded-b-md flex gap-2 ': true,
    [contentClassName || '']: true
  })

  return <div className={classNames}>
    <div className='relative flex items-center w-full h-12 px-4 rounded-t-md bg-secondary'>
      <div className='absolute inset-0 w-full h-full rounded-t-md opacity-5' style={{backgroundColor: overlayColor}} />
      <h3 className='text-lg text-semibold' >{title}</h3>
    </div>
    <div className={contentClassNames}>
      {children}
    </div>
  </div>
}

export default UserProfileSection
