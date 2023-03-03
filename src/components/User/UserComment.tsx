import * as React from 'react'

import { profile } from 'console'
import { ArrowBendDownRight, ArrowDown, ArrowElbowDownRight, ArrowRight } from 'phosphor-react'

import UserBadge from './UserBadge'

interface IUserCommentProps {
  comment: Anima.RAW.Comment
  isChildren?: boolean
}

const UserComment: React.FunctionComponent<IUserCommentProps> = ({ comment, isChildren }) => {
  const [showChildren, setShowChildren] = React.useState(true)

  if (isChildren) {
    return (
      <article className="relative flex w-full items-center gap-2 overflow-hidden bg-secondary bg-cover bg-center p-2 pl-8 group-last-of-type:rounded-b-md ">
        {(comment.User?.premium > 0 || comment.User?.staff) && (
          <div
            className="absolute top-0 left-0 z-[0] h-full w-full opacity-5"
            style={{ backgroundColor: comment.User?.UserProfile.color }}
          />
        )}
        <ArrowElbowDownRight size={24} className="text-subtle mr-4" />
        <div
          className="rounded-full bg-primary bg-cover bg-center px-6 py-6"
          style={{ backgroundImage: `url('${comment.User?.UserProfile.avatar}')` }}
        />
        <div className="flex w-full flex-col items-start gap-1">
          <div
            className="text-lg font-semibold flex items-center z-[1]"
            style={{ color: comment.User?.UserProfile?.color || '#FFFFFF' }}
          >
            <div className='flex flex-row gap-2 items-center'>
            {comment.User?.username || 'User'}
            {comment.User?.UserProfile?.Badge?.map((badge, i) => {
              if (badge.icon) return
              return <UserBadge badge={badge} key={`user.${badge.name}.${i}`} />
            })}
          </div>
          </div>
          {comment.comment}
        </div>
      </article>
    )
  }
  return <>
    <div className={'relative flex w-full gap-4 overflow-hidden bg-secondary p-4 ' + ((comment.Children.length > 0 && showChildren) ? 'mb-0 rounded-t-md mt-2' : 'mt-2 rounded-md')} >
    {/* {(true) && ( */}
    {(comment.User.premium > 0 || comment.User.staff) && (
        <div
          className="absolute top-0 left-0 z-[0] h-full w-full opacity-5"
          style={{ backgroundColor: comment.User?.UserProfile.color }}
        />
      )}
      <div className='absolute px-2 py-1 right-4 top-4 bg-black/30 rounded-md cursor-pointer hover:bg-accent z-[2] hover:text-primary text-subtle' onClick={()=>{setShowChildren(!showChildren)}}>
        {comment.Children.length > 0 && (showChildren ? (
          <span className='flex items-center text-xs gap-2'>Collapse <ArrowRight /></span>
        ): (
          <span className='flex items-center text-xs gap-2'>Collapse <ArrowDown /></span>
        ))}
      </div>
      <div className="z-[1] flex">
        <img src={comment.User?.UserProfile?.avatar} className="aspect-square h-16 rounded-full" />
      </div>
      <div className="z-[1] flex w-full flex-col gap-1">
        <div
          className="text-lg font-semibold flex gap-4 items-center"
          style={{ color: comment.User?.UserProfile?.color || '#FFFFFF' }}
        >
          <div className='flex flex-row gap-2 items-center'>
            {comment.User.username || 'User'}
            {comment.User?.UserProfile?.Badge?.map((badge, i) => {
              if (badge.icon) return
              return <UserBadge badge={badge} key={`user.${badge.name}.${i}`} />
            })}
          </div>
          <div className="mt-1.5 flex gap-2">
            {comment.User?.UserProfile?.Badge?.map((badge, i) => {
              if (!badge.icon) return
              return <UserBadge badge={badge} key={`user.${badge.name}.${i}`} />
            })}
          </div>
        </div>
        {comment.comment}
        <div className='w-min h-4 text-xs flex'>
          <button className='px-2 py-3 rounded-md bg-tertiary flex items-center hover:bg-accent hover:text-primary duration-300 '>
            <ArrowBendDownRight  className='mr-2'/> Reply
          </button>
        </div>
      </div>
    </div>
    <div className='group'>
      {showChildren && comment?.Children?.map((c) => {
        return (
          <UserComment
            key={`comment.${comment.id}.reply.${c.id}`}
            comment={c}
            isChildren={true}
          />
        )
      })}
    </div>
  </>
}

export default UserComment
