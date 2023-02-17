import React from 'react'

type Props = {
  children: React.ReactNode | React.ReactNode[] | JSX.Element | JSX.Element[]
}

function Media({ children }: Props) {
  return (
    <main className="flex h-screen w-screen overflow-hidden" id="content">
      {children}
    </main>
  )
}

export default Media
