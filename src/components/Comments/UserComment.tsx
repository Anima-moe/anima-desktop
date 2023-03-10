import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import clsx from 'clsx'
import { useAtom } from 'jotai'
import Link from 'next/link'
import { ArrowBendDownRight, ArrowDown, ArrowElbowDownRight, ArrowRight, Chat, Chats, Eye, EyeClosed, PaperPlaneRight } from 'phosphor-react'

import Button from '@/components/General/Button'
import IconInput from '@/components/General/Inputs/IconTextInput'
import UserBadge from '@/components/User/UserBadge'
import { Episode } from '@/services/anima/episode'
import { userPreferedPlayerMode } from '@/stores/atoms'
import * as Tooltip from '@radix-ui/react-tooltip'

import FloatingProfile from '../User/FloatingProfile'

interface IUserCommentProps {
  comment: Anima.RAW.Comment
  nestLevel?: number
  episodeID: number
  onReply?: (text: string) => void
}

const UserComment: React.FunctionComponent<IUserCommentProps> = ({ comment, nestLevel = 0, onReply, episodeID }) => {
  const { handleSubmit, control, formState: { errors }, reset } = useForm<{comment: string}>()
  const [showChildren, setShowChildren] = useState(true)
  const [showReply, setShowReply] = useState(false)
  const [playerMode] = useAtom(userPreferedPlayerMode)
  const { t } = useTranslation()

  function handleReplySend(data: {comment: string}) {
    Episode.createComment(episodeID, data.comment, comment.id)
    .then(()=>{
      setShowReply(false)
      onReply?.(data.comment)
      reset({
        comment: ''
      })
    })
  }


  const containerClassNames = clsx({
    'relative flex w-full gap-4 overflow-hidden bg-secondary p-4': true,
    'mb-0 rounded-t-md': !comment.parent_id && comment?.Children?.length > 0 && (showChildren || showReply),
    'rounded-md': !comment.parent_id && comment?.Children?.length === 0 || comment?.Children?.length > 0 && !showChildren,
    'mt-2': !comment.parent_id,
  })
  
  const commentContainerClassNames = clsx({
    'z-[1] flex w-full flex-col gap-1': true,
    '': (nestLevel > 0),
  })
  
  const avatarClassNames = clsx({
    'aspect-square rounded-full z-[1] flex bg-primary bg-cover bg-center cursor-pointer': true,
    'h-12': (nestLevel > 0),
    'h-14': (nestLevel < 1)
  })

  const userNameClassNames = clsx({
    'text-lg font-semibold flex gap-2 items-center': true,
    'text-sm': (nestLevel > 0),
  })

  const commentClassNames = clsx({
    'text-md': true,
    'text-sm': (nestLevel > 0),
  })

  return <>
    <div className={containerClassNames} >
    {/* {(true) && ( */}
      {/* ACCENT */}
      {(comment.User.premium > 0 || comment.User.staff) && (
        <div
          className='absolute top-0 left-0 z-[0] h-full w-full opacity-5'
          style={{ backgroundColor: comment.User?.UserProfile.color }}
        />
      )}
      
      {/* COLLAPSE */}
      {comment.Children.length > 0 && <div className='absolute px-2 py-1 right-4 top-4 bg-black/30 rounded-md cursor-pointer hover:bg-accent z-[2] hover:text-primary text-subtle' onClick={()=>{setShowChildren(!showChildren)}}>
        <span className='flex items-center text-xs gap-2'>{t(showChildren ? 'action_hideComments' : 'action_showComments')}{ showChildren ? <Eye /> : <EyeClosed /> }</span>  
      </div> }

      {/* NEST INDICATOR */}
      {(nestLevel > 0) && (
        <ArrowElbowDownRight size={24} className='text-subtle mr-4 my-auto' style={{ marginLeft: `calc(${nestLevel > 1 ? '2rem' : '1rem'}*${nestLevel})`}} />
      )}

      {/* AVATAR */}
      <Tooltip.Provider delayDuration={500}> 
        <Tooltip.Root>
          <Tooltip.Trigger asChild >
            <Link href={`/user/${comment.User.id}`} className={avatarClassNames} style={{ backgroundImage: `url(${comment.User?.UserProfile?.avatar})` }} />
          </Tooltip.Trigger>
          <FloatingProfile user={comment.User} />
        </Tooltip.Root>
      </Tooltip.Provider>
      
      {/* COMMENT CONTAINER */}
      <div className={commentContainerClassNames}>
        {/* USERNAME & BADGES */}
        <div
          className={userNameClassNames}
          style={{ color: comment.User?.UserProfile?.color || '#FFFFFF' }}
        >
          <div className='flex flex-row gap-2 items-center'>
            <Tooltip.Provider delayDuration={500}> 
              <Tooltip.Root>
                <Tooltip.Trigger asChild >
                  <Link href={`/user/${comment.User.id}`} className='cursor-pointer'>{comment.User.username || 'User'}</Link>
                </Tooltip.Trigger>
                <FloatingProfile user={comment.User} />
              </Tooltip.Root>
            </Tooltip.Provider>
            {comment.User?.UserProfile?.Badge?.map((badge, i) => {
              if (badge.icon) return
              return <UserBadge badge={badge} key={`user.${badge.name}.${i}`} />
            })}
          </div>
          {(nestLevel < 1) && (
            <div className='flex gap-2'>
              {comment.User?.UserProfile?.Badge?.map((badge, i) => {
                if (!badge.icon) return
                return <UserBadge badge={badge} key={`user.${badge.name}.${i}`}  className='!w-5 !h-5' />
              })}
            </div>
          )}
        </div>
        
        {/* COMMENT */}
        <div className={commentClassNames}>
         {comment.comment}
        </div>

        {/* REPLY BUTTON */}
        {(nestLevel < 2) && (
          <div className='w-min h-4 text-xs flex'>
            <button 
              className='px-2 py-3 rounded-md bg-tertiary flex items-center hover:bg-accent hover:text-primary duration-300 '
              onClick={()=>{
                setShowReply(!showReply)
              }}
            >
              <ArrowBendDownRight  className='mr-2' /> 
              {t('action_reply')}
            </button>
          </div>
        )}
      </div>
    </div>
    <div className='group'>
      {showReply && (
        <form className='flex items-center w-full gap-4 relative pl-5 bg-secondary border border-tertiary' onSubmit={handleSubmit(handleReplySend)}>
          <Controller
              name='comment'
              control={control}
              rules={{ required: false }}
              render={({ field }) => (
                <IconInput Icon={Chats} placeholder={t('action_writeReply')} className='h-16 -my-1.5 !rounded-none !border-none !pl-16' type="text" error={errors['comment'] && errors['comment'].message} {...field}/>
              )}
            />

            <Button Icon={<PaperPlaneRight />} text='' secondary className='hover:!bg-accent hover:text-primary bg-tertiary absolute aspect-square !h-12 items-center justify-center right-4' />
        </form>
      )}
      {showChildren && comment?.Children?.map((c) => {
        return (
          <UserComment
            key={`comment.${comment.id}.reply.${c.id}`}
            comment={c}
            nestLevel={nestLevel + 1}
            episodeID={episodeID}
          />
        )
      })}
    </div>
  </>
}

export default UserComment
