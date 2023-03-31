import * as React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import dayjs from 'dayjs'
import { Chat, PaperPlaneRight } from 'phosphor-react'

import UserComment from '@/components/Comments/UserComment'
import Button from '@/components/General/Button'
import IconInput from '@/components/General/Inputs/IconTextInput'
import { Episode } from '@/services/anima/episode'
 
interface IUserCommentProps {
  Comments: Anima.RAW.Comment[]
  episodeID: number
  onComment: () => void
}

const UserComments: React.FunctionComponent<IUserCommentProps> = (props) => {
  const { handleSubmit, control, formState: { errors }, reset } = useForm<{comment: string}>()
  const { t } = useTranslation()
  function handleCommentSend(data: {comment: string}) {
    Episode.createComment(props.episodeID, data.comment)
    .then(()=>{
      props?.onComment?.()
      reset({
        comment: ''
      })
    })
  }

  return <div className='w-full mb-8 !max-w-[98vw]'>
    <h1 className='text-subtle'>{t('generic.section.comments')}</h1>
    <div className='flex flex-col w-full'>
      <form className='relative flex items-center w-full gap-4' onSubmit={handleSubmit(handleCommentSend)}>
        <Controller
            name='comment'
            control={control}
            rules={{ required: false }}
            render={({ field }) => (
              <IconInput Icon={Chat} placeholder={t('generic.action.writeComment')} className='h-16 pr-20' type="text" error={errors['comment'] && errors['comment'].message} {...field}/>
            )}
          />

          <Button Icon={<PaperPlaneRight />} text='' secondary className='bg-tertiary hover:!bg-accent hover:text-primary !absolute aspect-square !h-12 items-center justify-center right-4' />
      </form>
      <div className='comments-wrapper'>
        {props.Comments 
          && props.Comments.length > 0 
          && props.Comments
              .sort((a,b) => (dayjs(b.created_at).unix()) - (dayjs(a.created_at).unix()) )
              .sort((a,b) => b.User.premium - a.User.premium)
              // .sort((a,b) => Number(b.User.staff) - Number(a.User.staff) )
              .map(comment => {
          return <UserComment key={`comment.${comment.id}`} comment={comment} episodeID={props.episodeID} onReply={()=> { props.onComment?.() }}/>
        })}
      </div>
    </div>
  </div>
  
}

export default UserComments
