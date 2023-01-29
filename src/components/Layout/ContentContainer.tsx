import React from 'react'

type Props = {
  children: React.ReactNode | React.ReactNode[] | JSX.Element | JSX.Element[]
}

function ContentContainer({children}: Props) {
  return <div className="px-8 py-4 mt-4 flex flex-col">
    {children}
  </div>
}

export default ContentContainer