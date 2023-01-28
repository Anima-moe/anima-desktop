import Navbar from '@/components/Navbar'

type Props = {
  children: React.ReactNode | React.ReactNode[]
  fluid?: boolean
}

function General({children, fluid}: Props) {
  return <>
    <Navbar />
    <main className={`pt-16 flex flex-col ${fluid ? 'px-0 w-full' : 'px-4'}`}>
      {children}
    </main>
  </>
}

export default General