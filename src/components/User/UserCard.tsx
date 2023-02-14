type Props = {
  showStatics?: boolean
}

const UserCard = ({ showStatics }: Props) => {
  return (
    <>
      <div
        className="h-48 rounded-t-md bg-tertiary bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(/i/splash_image_bocchi_1.png)',
        }}
      />
      <div className="relative mb-4 flex h-24 justify-between overflow-hidden rounded-b-md bg-secondary px-8">
        <div className="pointer-events-none absolute top-0 left-0 z-[0] h-full w-full bg-accent/10" />
        <div className="z-[1] flex items-center">
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
        {showStatics && (
          <div className="flex items-center gap-x-8">
            {Array.from({ length: 3 }).map((item, i) => (
              <div key={i} className="flex flex-col items-center ">
                <span className="text-2xl font-semibold text-accent">0</span>
                <span className="">Coment</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}

export default UserCard
