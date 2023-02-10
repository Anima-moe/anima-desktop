import React from 'react'

type Props = {}

function Watermark({}: Props) {
  return (
    <div className='ml-auto mt-auto opacity-20'>
      <img src='/i/anima.svg' />
    </div>
  )
}

export default Watermark