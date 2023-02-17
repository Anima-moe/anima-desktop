import React, { memo, Fragment } from 'react'

export default memo(function time({ text }: { text: string }) {
  return (
    <div className="flex w-full flex-col items-center text-center">
      {text.split('\n').map((item, index, array) => (
        <Fragment key={index}>
          <text
            className="mb-0.5 rounded-md bg-primary bg-opacity-95 px-6 py-1.5"
            dangerouslySetInnerHTML={{ __html: item }}
          />
        </Fragment>
      ))}
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
