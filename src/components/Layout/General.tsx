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
      <main className={`mt-10 max-h-[calc(100vh-41px)] rounded-b-lg flex flex-col bg-primary h-[calc(100vh-32px)] relative ${fluid ? 'w-full px-0' : 'px-8'} select-none`} id="animacontent">
        {children}
      </main>
    </>
  )
}

export default General
