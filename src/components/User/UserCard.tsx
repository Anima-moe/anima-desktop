import { useTranslation } from 'react-i18next'

import { NotePencil } from 'phosphor-react'

import Button from '@/components/General/Button'

import UserBadge from './UserBadge'

type Props = {
  showStatics?: boolean
  user: Anima.RAW.User
}

const properCase = (str: string) => {
  return str
    ?.split(' ')
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(' ')
}

const beautyNumber = (number: number) => {
  if (number < 100) return `00${number}`
  return number
}

const UserCard = ({ showStatics, user }: Props) => {
  const { t } = useTranslation()
  return (
    <>
      <div
        className="relative h-48 rounded-t-md bg-tertiary bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${user?.profile?.background})`,
        }}
      >
        <span
          className="absolute left-4 top-4 rounded-md px-2 py-1 text-xs font-medium text-primary"
          style={{ backgroundColor: `${user?.profile?.color || '#161616'}` }}
        >
          #{beautyNumber(user?.id)}
        </span>
        <div className="absolute right-4 top-4">
          <Button
            secondary
            Icon={<NotePencil className="mr-3" />}
            text={t('user_menu_settings')}
            iconLeft
            xs
          />
        </div>
      </div>
      <div className="relative mb-4 flex h-24 justify-between overflow-hidden rounded-b-md bg-secondary px-8">
        <div
          className="pointer-events-none absolute top-0 left-0 z-[0] h-full w-full opacity-10"
          style={{ backgroundColor: `${user?.profile?.color || '#161616'}` }}
        />
        <div className="z-[1] flex items-center">
          <span
            className="mr-4 h-20 w-20 rounded-full bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: 'url(/test/avtr.png)' }}
          />
          <div className="flex flex-col">
            <div className="flex items-center gap-x-3">
              <span
                className="text-2xl font-semibold"
                style={{ color: `${user?.profile?.color || '#161616'}` }}
              >
                {properCase(user?.username)}
              </span>
              {user?.profile?.Badge?.map((badge, i) => {
                if (badge.icon) return
                return <UserBadge badge={badge} key={`user.${badge.name}.${i}`} />
              })}
            </div>
            <div className="mt-1.5 flex gap-2">
              {user?.profile?.Badge?.map((badge, i) => {
                if (!badge.icon) return
                return <UserBadge badge={badge} key={`user.${badge.name}.${i}`} />
              })}
            </div>
          </div>
        </div>
        {showStatics && (
          <div className="flex items-center gap-x-8">
            {Array.from({ length: 3 }).map((item, i) => (
              <div key={i} className="flex flex-col items-center ">
                <span
                  className="text-2xl font-semibold"
                  style={{ color: `${user?.profile?.color || '#161616'}` }}
                >
                  0
                </span>
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
