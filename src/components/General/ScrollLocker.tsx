import usePreventBodyScroll from '@/hooks/usePreventBodyScroll'

type Props = {
  children: React.ReactNode
}

function ScrollLocker({ children }: Props) {
  const { disableScroll, enableScroll } = usePreventBodyScroll()

  return (
    <div
      onMouseEnter={(e) => {
        disableScroll()
      }}
      onMouseLeave={(e) => {
        enableScroll()
      }}
    >
      {children}
    </div>
  )
}

export default ScrollLocker
