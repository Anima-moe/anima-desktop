import { Scrollbars } from 'react-custom-scrollbars'

import Navbar from '@/components/Navbar'

type Props = {
  children: React.ReactNode | React.ReactNode[]
  fluid?: boolean
}

function General({ children, fluid }: Props) {
  return (
    <>
      <Navbar />
      <main className={`flex h-full flex-col ${fluid ? 'w-full px-0' : 'px-8'}`} id="animacontent">
        {children}
      </main>
    </>
  )
}

export default General
