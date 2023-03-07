import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { ArrowBendDownRight, ArrowDown, ArrowElbowDownRight, ArrowRight, Chat, Chats, Eye, EyeClosed, PaperPlaneRight } from 'phosphor-react'

import Button from '@/components/General/Button'
import IconInput from '@/components/General/Inputs/IconTextInput'
import UserBadge from '@/components/User/UserBadge'
import { Episode } from '@/services/anima/episode'



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
  const { t } = useTranslation()

  function handleReplySend(data: {comment: string}) {
    Episode.createComment(episodeID, data.comment, comment.id)
    .then(()=>{
      onReply?.(data.comment)
      reset({
        comment: ''
      })
    })
  }
  
  if (nestLevel > 0) {
    return (
      <article className='relative flex w-full items-center gap-2 overflow-hidden bg-secondary bg-cover bg-center p-2 pl-8 group-last-of-type:rounded-b-md '>
        {(comment.User?.premium > 0 || comment.User?.staff) && (
          <div
            className='absolute top-0 left-0 z-[0] h-full w-full opacity-5'
            style={{ backgroundColor: comment.User?.UserProfile.color }}
          />
        )}
        <ArrowElbowDownRight size={24} className='text-subtle mr-4' />
        <div
          className='rounded-full bg-primary bg-cover bg-center px-6 py-6'
          style={{ backgroundImage: `url('${comment.User?.UserProfile.avatar}')` }}
        />
        <div className='flex w-full flex-col items-start gap-1'>
          <div
            className='text-lg font-semibold flex items-center z-[1]'
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
    <div className={'relative flex w-full gap-4 overflow-hidden bg-secondary p-4 ' + ((comment.Children.length > 0 && showChildren || showReply) ? 'mb-0 rounded-t-md mt-2' : 'mt-2 rounded-md')} >
    {/* {(true) && ( */}
    {(comment.User.premium > 0 || comment.User.staff) && (
        <div
          className='absolute top-0 left-0 z-[0] h-full w-full opacity-5'
          style={{ backgroundColor: comment.User?.UserProfile.color }}
        />
      )}
      {comment.Children.length > 0 && <div className='absolute px-2 py-1 right-4 top-4 bg-black/30 rounded-md cursor-pointer hover:bg-accent z-[2] hover:text-primary text-subtle' onClick={()=>{setShowChildren(!showChildren)}}>
        {showChildren ? (
          <span className='flex items-center text-xs gap-2'>{t('action_hideComments')}<Eye /></span>
        ): (
          <span className='flex items-center text-xs gap-2'>{t('action_showComments')} <EyeClosed /></span>
        )}
      </div> }
      <div className='h-16 aspect-square rounded-full z-[1] flex bg-primary bg-cover bg-center' style={{ backgroundImage: `url(${comment.User?.UserProfile?.avatar})` }} />
      <div className='z-[1] flex w-full flex-col gap-1'>
        <div
          className='text-lg font-semibold flex gap-4 items-center'
          style={{ color: comment.User?.UserProfile?.color || '#FFFFFF' }}
        >
          <div className='flex flex-row gap-2 items-center'>
            {comment.User.username || 'User'}
            {comment.User?.UserProfile?.Badge?.map((badge, i) => {
              if (badge.icon) return
              return <UserBadge badge={badge} key={`user.${badge.name}.${i}`} />
            })}
          </div>
          <div className='flex gap-2'>
            {comment.User?.UserProfile?.Badge?.map((badge, i) => {
              if (!badge.icon) return
              return <UserBadge badge={badge} key={`user.${badge.name}.${i}`} />
            })}
          </div>
        </div>
        {comment.comment}
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
