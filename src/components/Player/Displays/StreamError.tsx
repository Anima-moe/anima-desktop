import React from 'react'

type Props = {
  error: Error | string
}

function StreamError({error}: Props) {
  return (
    <div className='w-full h-full items-center justify-center flex flex-col absolute top-0 left-0'>
      <div className='aspect-video h-[50vh] bg-secondary rounded-md flex flex-row overflow-hidden'>
        <div className={`w-1/2 h-full bg-center bg-cover`} style={{backgroundImage: `url(/bocchi_error.gif)`}}></div>
        <div className='w-1/2  p-4 flex flex-col'>
          <h1 className=''>Ops, algo deu errado</h1>
          {JSON.stringify(`${error}`)}
        </div>
      </div>
    </div>
  )
}

export default StreamError