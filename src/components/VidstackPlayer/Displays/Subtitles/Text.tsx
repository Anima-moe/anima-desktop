import React, { memo, Fragment } from 'react'

export default memo(function time({ text }: { text: string }) {
  return (
    <div className="flex flex-col text-center w-full items-center">
      {
        text
          .split('\n')
          .map(
            (item, index, array) => (
              <Fragment key={index}>
                <text className='bg-primary rounded-md px-6 bg-opacity-95 py-1.5 mb-0.5' dangerouslySetInnerHTML={{__html: item}}/>
              </Fragment>
            )
          )
      }
      {/* <style>
        {`
          text {
            font-family: sans-serif;
            font-weight: bold;
            font-size: 6vmin;
            color: white;
            -webkit-text-stroke: .02em black;
            text-shadow: .04em .04em .04em rgba(0,0,0,.4);
          }
        `}
      </style> */}
    </div>
  )
})