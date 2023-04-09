import { useEffect, useRef } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import clsx from 'clsx'
import { motion, AnimatePresence } from 'framer-motion'
import { ChatCentered, ChatCenteredDots, PaperPlane, PaperPlaneTilt } from 'phosphor-react'

import Button from '../General/Button'
import IconInput from '../General/Inputs/IconTextInput'

interface IChatProps {
  self: number
  room: Anima.TARDIS.Room
  onSendMessage: (message: string) => void
}

const Chat: React.FunctionComponent<IChatProps> = (props) => {
  const chatInput = useRef('')
  const scroller = useRef<HTMLDivElement>(null)
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
    setValue
  } = useForm<{ content: string }>({
    defaultValues: {
      content: '',
    },
  })
  const { t } = useTranslation()

  const onSubmit: SubmitHandler<{ content: string }> = async (data) => {
    if (!data.content) { return }
    if (errors['content']) { return }
    
    props.onSendMessage?.(data.content)
    setValue('content', '')
  }

  useEffect(()=>{
    if (!scroller) { return }
    scroller.current.scrollTop = scroller.current.scrollHeight
  }, [scroller, props.room])

  return (
    <div className="flex h-[calc(calc(calc(100vw*.66)/16)*9-23px)] w-full flex-col justify-end gap-2 overflow-y-scroll rounded-md bg-secondary p-2 overflow-x-hidden">
      <div className='flex flex-col justify-end w-full h-full gap-2 overflow-y-auto' ref={scroller}>
        <AnimatePresence>
          {props.room.messages?.map((packet, index) => {
            const bubbleClass = clsx({
              'flex gap-2 items-center w-full': true,
              'items-start': packet.author.id === props.self,
              'items-end': packet.author.id !== props.self,
            })
            return (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                key={`message.${index}.${props.room.id}`}
              >
                <span
                  className=""
                  style={{
                    color: packet.author.payload?.profile?.color,
                  }}
                >
                  {packet.author.payload.username}
                </span>
                <div className={bubbleClass}>{packet.content}</div>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Controller
          key="content"
          name="content"
          control={control}
          rules={{
            minLength: {
              value: 2,
              message: t('w2g.error.tooShort', { n: 3 }),
            },
          }}
          render={({ field }) => (
            <IconInput
              Icon={ChatCenteredDots}
              className="text-xs"
              id="content"
              type="text"
              placeholder={t('w2g.action.writeMessage')}
              onChange={(e) => {
                chatInput.current = e.target.value
              }}
              error={errors['content']?.message}
              {...field}
            >
            </IconInput>
          )}
        />
      </form>
    </div>
  )
}

export default Chat
