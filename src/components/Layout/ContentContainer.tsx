import React from 'react'

import { C } from '@tauri-apps/api/event-2a9960e7'

type Props = {
  children: React.ReactNode | React.ReactNode[] | JSX.Element | JSX.Element[]
  className?: string
}

function ContentContainer({ children, className }: Props) {
  return <div className={'mt-4 flex flex-col px-8 py-4 ' + className}>{children}</div>
}

export default ContentContainer
