import GeneralLayout from '@/components/Layout/General'

const User = () => {
  const background = '/i/splash.mp4' // example

  return (
    <GeneralLayout fluid>
      <div className={'absolute top-0 left-0 w-full h-full cover z-[-1] overflow-hidden'}>
        {(background) ? (
            (background.endsWith('.mp4') || background.endsWith('.webm')) && (
              <video autoPlay loop muted className='w-full h-full object-cover' src={background} />
            )
          ) : (
            <video autoPlay loop muted className='w-full h-full object-cover' src='/i/splash.mp4' />
        )}
      </div>
      <div className='from-primary w-full h-full absolute top-0 left-0 to-transparent bg-primary/70 bg-gradient-to-t' />
      <div className="z-10 mx-8 my-24">
        <div
          className="h-48 rounded-t-md bg-tertiary bg-cover bg-no-repeat bg-center"
          style={{
            backgroundImage: 'url(/i/splash_image_bocchi_1.png)',
          }}
        />
        <div className="mb-4 flex h-24 justify-between rounded-b-md bg-secondary px-8 relative overflow-hidden">
          <div className='absolute top-0 left-0 w-full h-full bg-accent/10 pointer-events-none z-[0]' />
          <div className="flex items-center z-[1]">
            <span
              className="mr-4 h-20 w-20 rounded-full bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: 'url(/test/avtr.png)' }}
            />
            <div className="flex flex-col">
              <div className="flex items-center gap-x-3">
                <span className="text-2xl font-semibold text-accent">Nodge</span>
                <span className="rounded-md bg-tertiary px-2 py-1 text-xs">Staff</span>
              </div>
              <div className="flex">x y</div>
            </div>
          </div>
          <div className="flex items-center gap-x-8">
            {Array.from({ length: 3 }).map((item, i) => (
              <div key={i} className="flex flex-col items-center ">
                <span className="text-2xl font-semibold text-accent">0</span>
                <span className="">Coment</span>
              </div>
            ))}
          </div>
        </div>
        <div className="flex w-full flex-col gap-y-4 rounded-md bg-secondary p-5">
          {Array.from({ length: 2 }).map((item, i) => (
            <div key={i} className="flex flex-col gap-y-2 overflow-hidden">
              <span className="text-xl text-subtle">Hist</span>
              <div className="flex gap-x-4">
                {Array.from({ length: 7 }).map((item, i) => (
                  <img
                    key={i}
                    src="/test/hist.png"
                    alt=""
                    className="bg-cover bg-center bg-no-repeat"
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </GeneralLayout>
  )
}

export default User
