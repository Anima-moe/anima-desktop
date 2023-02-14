import GeneralLayout from '@/components/Layout/General'
import TitleInput, { TitleInputProps } from '@/components/splashscreen/Inputs/TitleInput'
import UserCard from '@/components/User/UserCard'

const User = () => {
  const background = '/i/splash.mp4' // example
  const inputs: TitleInputProps[] = [
    { title: 'Email', type: 'email' },
    { title: 'Senha', type: 'password' },
    { title: 'Avatar', type: 'url' },
    { title: 'Capa', type: 'url' },
    { title: 'Fundo', type: 'url' },
    { title: 'Cor', type: 'color' },
    { title: 'Email', type: 'email' },
  ]

  return (
    <GeneralLayout fluid>
      <div className={'cover absolute top-0 left-0 z-[-1] h-full w-full overflow-hidden'}>
        {background ? (
          (background.endsWith('.mp4') || background.endsWith('.webm')) && (
            <video autoPlay loop muted className="h-full w-full object-cover" src={background} />
          )
        ) : (
          <video autoPlay loop muted className="h-full w-full object-cover" src="/i/splash.mp4" />
        )}
      </div>
      <div className="absolute top-0 left-0 h-full w-full bg-primary/70 bg-gradient-to-t from-primary to-transparent" />
      <div className="z-10 mx-auto my-24 w-full max-w-2xl">
        <UserCard />

        <div className="flex w-full flex-col gap-y-4 rounded-md bg-secondary p-5">
          {inputs.map((input, i) => (
            <TitleInput key={i} {...input} />
          ))}
        </div>
      </div>
    </GeneralLayout>
  )
}

export default User
