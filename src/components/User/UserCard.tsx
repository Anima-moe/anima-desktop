import { useTranslation } from 'react-i18next'

import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import Link from 'next/link'
import { NotePencil } from 'phosphor-react'

import Button from '@/components/General/Button'

import UserBadge from './UserBadge'

type Props = {
  showStatics?: boolean
  user: Anima.RAW.User
  showEditButton?: boolean
}

dayjs.extend(duration)

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

const UserCard = ({ showStatics, user, showEditButton }: Props) => {
  const { t } = useTranslation()
  return (
    <div className="relative">
      <div
        className="relative mb-8 h-72 select-none rounded-md bg-tertiary bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${user?.profile?.banner})`,
        }}
      >
        <span
          className="absolute left-4 top-4 rounded-md px-2 py-1 text-xs font-semibold text-primary"
          style={{ backgroundColor: `${user?.profile?.color || '#161616'}` }}
        >
          #{beautyNumber(user?.id)}
        </span>
        <div className="absolute right-4 top-4">
          {showEditButton && (
            <Link href="/user/me/edit">
              <Button
                secondary
                Icon={<NotePencil className="ml-3" />}
                text={t('user_menu_settings')}
                xs
              />
            </Link>
          )}
        </div>
      </div>
      <div className="absolute bottom-0 left-0 flex h-24 w-full justify-between overflow-hidden rounded-b-md bg-secondary bg-opacity-80 px-4 backdrop-blur-xl">
        <div
          className="pointer-events-none absolute top-0 left-0 z-[0] h-full w-full opacity-10"
          style={{ backgroundColor: `${user?.profile?.color || '#161616'}` }}
        />
        <div className="z-[1] flex items-center">
          <span
            className="mr-4 h-20 w-20 rounded-full bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url('${
                user?.profile?.avatar ?? 'https://i.imgur.com/CBdQGA3.png'
              }')`,
            }}
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
            <div className="flex flex-col items-center ">
              <span
                className="text-2xl font-semibold"
                style={{ color: `${user?.profile?.color || '#161616'}` }}
              >
                {user?._count?.Comment}
              </span>
              <span className="">Coments</span>
            </div>
            <div className="flex flex-col items-center ">
              <span
                className="text-2xl font-semibold"
                style={{ color: `${user?.profile?.color || '#161616'}` }}
              >
                {user?._count?.UserPlayerHead || 0}
              </span>
              <span className="">Episodes</span>
            </div>
            <div className="flex flex-col items-center ">
              <span
                className="text-2xl font-semibold"
                style={{ color: `${user?.profile?.color || '#161616'}` }}
              >
                {parseFloat(dayjs.duration({ seconds: user?.UserPlayerHead?.reduce((acc, curr) => { return acc + curr.duration }, 0) }).asHours().toString()).toFixed(1)}
              </span>
              <span className="">Hours</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default UserCard
