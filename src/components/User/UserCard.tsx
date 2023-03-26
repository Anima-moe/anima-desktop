import { useTranslation } from 'react-i18next'

import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import Link from 'next/link'
import { NotePencil, Plus } from 'phosphor-react'

import Button from '@/components/General/Button'

import UserBadge from './UserBadge'

type Props = {
  showStatics?: boolean
  user: Anima.RAW.User
  showEditButton?: boolean
  showAddConnectionButton?: boolean
}

dayjs.extend(duration)

const properCase = (str: string) => {
  return str
    ?.split(' ')
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(' ')
}

const beautyNumber = (number: number) => {
  if (number < 10) return `00${number}`
  if (number < 100) return `0${number}`
  return number
}

const UserCard = ({ showStatics, user, showEditButton, showAddConnectionButton }: Props) => {
  const { t } = useTranslation()
  return (
    <div className="relative flex flex-col w-full px-8">
      {/* BANNER */}
      <div className="h-[300px] w-full rounded-t-md bg-cover bg-center relative" style={{ backgroundImage: `url('${user?.profile?.banner}')` }}>
        <div className="absolute px-2 py-1 text-xs rounded-md bg-secondary w-min top-2 left-2">#{beautyNumber(user.id)}</div>
      </div>
      {/* AVATAR */}
      <div
        className="absolute left-1/2 top-[300px] h-32 w-32  -translate-x-1/2 -translate-y-2/3 rounded-md bg-cover bg-center bg-no-repeat z-[1]"
        style={{
          backgroundImage: `url('${user?.profile?.avatar ?? 'https://i.imgur.com/CBdQGA3.png'}')`,
        }}
      >
        {user?.profile?.Badge?.map((badge, i) => {
          if (badge.icon) return
          return (
            <UserBadge className="!absolute !bottom-0 !left-1/2 translate-y-1/2 !-translate-x-1/2 z-[2]" badge={badge} key={`user.${badge.name}.${i}`} />
          )
        })}
        {showEditButton && (
            <Link href="/user/me/edit">
              <Button
                secondary
                Icon={<NotePencil className="" />}
                // text={t('user_menu_settings')}
                text=''
                className="!px-0 !py-0 !rounded-full !w-8 !h-8 bg-primary flex items-center justify-center !absolute !right-0 !top-0 translate-x-1/2 -translate-y-1/2"
                iconClassName='px-1 py-1'
                xs
              />
            </Link>
          )}
      </div>
      
      <div className="flex h-[6.5rem] w-full justify-between rounded-b-md bg-secondary px-8 py-4 relative">
        <div className='absolute inset-0 w-full h-full opacity-5 z-[0] rounded-b-md' style={{backgroundColor: user.profile.color}} />
        <div className="flex items-center justify-start w-2/6 gap-3 z-[1]">
          {showAddConnectionButton && (
            <Button 
              text=''
              Icon={<Plus size={24} />}
              className='!border-dashed !border-1 !border-subtle text-subtle !p-2 hover:!border-solid hover:!bg-primary hover:text-accent duration-200'
            />
          )}
        </div>
        <div className="flex items-end justify-center w-2/6 h-full gap-3 z-[1] pointer-events-none">
          <h1 className="text-2xl font-bold" style={{ color: `${user?.profile?.color || '#8D8D8D'}` }}>
            {user.username}
          </h1>
        </div>
        {/* STATS */}
        <div className="flex items-center justify-end w-2/6 h-full gap-3 z-[1]">
          {showStatics && (
            <div className="flex items-center gap-x-8 text-subtle" >
              <div className="flex flex-col items-center ">
                <span className="text-2xl font-semibold" style={{ color: `${user?.profile?.color || '#8D8D8D'}` }}>
                  {user?._count?.Comment || 0}
                </span>
                <span className="">{t('user.stats.comments')}</span>
              </div>
              <div className="flex flex-col items-center ">
                <span className="text-2xl font-semibold" style={{ color: `${user?.profile?.color || '#8D8D8D'}` }}>
                  {user?._count?.UserPlayerHead || 0}
                </span>
                <span className="">{t('user.stats.episodes')}</span>
              </div>
              <div className="flex flex-col items-center ">
                <span className="text-2xl font-semibold" style={{ color: `${user?.profile?.color || '#8D8D8D'}` }}>
                  {dayjs
                    .duration({
                      seconds: user?.UserPlayerHead?.reduce((acc, curr) => {
                        return acc + curr.duration
                      }, 0),
                    })
                    .asHours()
                    .toFixed(1)} 
                </span>
                <span className="">{t('user.stats.hours')}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default UserCard
