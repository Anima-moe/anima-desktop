import React from 'react'

type Props = {
  children: React.ReactNode | React.ReactNode[] | JSX.Element | JSX.Element[]
}

function Media({children}: Props) {
  return <main className='flex flex-row'>
    {children}
  </main>
}

export default Media