import Navbar from '@/components/Navbar'
import { Scrollbars } from 'react-custom-scrollbars'

type Props = {
  children: React.ReactNode | React.ReactNode[]
  fluid?: boolean
}

function General({children, fluid}: Props) {
  return <>
    <Navbar />
    <main className={`h-screen flex flex-col ${fluid ? 'px-0 w-full' : 'px-8'}`}>
      <Scrollbars autoHide hideTracksWhenNotNeeded universal>
        {children}
      </Scrollbars>
    </main>
  </>
}

export default General