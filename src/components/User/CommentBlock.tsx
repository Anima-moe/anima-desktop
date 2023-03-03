import * as React from 'react'
import { Controller, useForm } from 'react-hook-form'

import { Chat, PaperPlaneRight } from 'phosphor-react'

import UserComment from '@/components/User/UserComment'
import { Episode } from '@/services/anima/episode'

import Button from '../General/Button'
import IconInput from '../General/Inputs/IconTextInput'
 
interface IUserCommentProps {
  Comments: Anima.RAW.Comment[]
  episodeId: number
  onComment: () => void
}

const UserComments: React.FunctionComponent<IUserCommentProps> = (props) => {
  const { register, handleSubmit, watch, control, formState: { errors }, } = useForm<{comment: string}>()
  
  function handleCommentSend(data: {comment: string}) {
    Episode.createComment(props.episodeId, data.comment)
    .then(()=>{
      props?.onComment?.()
    })
  }

  return <div className='w-full'>
    <h1 className='py-4 text-subtle'>Comments</h1>
    <div className='flex w-full flex-col'>
      <form className='flex items-center w-full gap-4 relative' onSubmit={handleSubmit(handleCommentSend)}>
        <Controller
            name='comment'
            control={control}
            rules={{ required: false }}
            render={({ field }) => (
              <IconInput Icon={Chat} placeholder='Write new comment' className='h-16' type="text" error={errors['comment'] && errors['comment'].message} {...field}/>
            )}
          />

          <Button Icon={<PaperPlaneRight />} text='' secondary className='aspect-square !h-16 items-center justify-center' />
      </form>
      <div className='comments-wrapper'>
        {props.Comments && props.Comments.length > 0 && props.Comments.map(comment => {
          return <UserComment key={`comment.${comment.id}`} comment={comment} />
        })}
      </div>
    </div>
  </div>
  
}

export default UserComments
