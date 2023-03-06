import clsx from 'clsx'

import { useMediaStore, useMediaRemote } from '@vidstack/react'

type Props = {
  time: number
}

function PlayButton({ time }: Props) {
  const remote = useMediaRemote()
  const { currentTime } = useMediaStore()
  const classes = clsx({
    'flex items-center justify-center cursor-pointer group pointer-events-auto hover:text-accent hover:bg-primary duration-200 aspcet-square rounded-md aspect-square w-10 h-10':
      true,
  })
  return (
    <div
      className={classes}
      onClick={() => {
        remote.seek(currentTime + time)
      }}
    >
      {time < 0 && (
        <svg viewBox='0 0 32 32' fill='none' aria-hidden='true' xmlns='http://www.w3.org/2000/svg' className='h-6 w-6 opacity-50 duration-300 group-hover:opacity-100'>
          <path d='M16.6667 10.3452C16.6667 10.8924 16.0439 11.2066 15.6038 10.8814L11.0766 7.5364C10.7159 7.26993 10.7159 6.73054 11.0766 6.46405L15.6038 3.11873C16.0439 2.79356 16.6667 3.10773 16.6667 3.6549V5.22682C16.6667 5.29746 16.7223 5.35579 16.7927 5.36066C22.6821 5.76757 27.3333 10.674 27.3333 16.6667C27.3333 22.9259 22.2592 28 16 28C9.96483 28 5.03145 23.2827 4.68601 17.3341C4.66466 16.9665 4.96518 16.6673 5.33339 16.6673H7.3334C7.70157 16.6673 7.99714 16.9668 8.02743 17.3337C8.36638 21.4399 11.8064 24.6667 16 24.6667C20.4183 24.6667 24 21.085 24 16.6667C24 12.5225 20.8483 9.11428 16.8113 8.70739C16.7337 8.69957 16.6667 8.76096 16.6667 8.83893V10.3452Z' fill='currentColor' />
          <path d='M13.9647 19.8182C14.0383 19.8182 14.098 19.7585 14.098 19.6849V14.1334C14.098 14.0597 14.0383 14 13.9647 14H12.8321C12.8072 14 12.7829 14.007 12.7617 14.0201L11.4223 14.8529C11.3832 14.8773 11.3594 14.9201 11.3594 14.9662V15.8702C11.3594 15.9743 11.4734 16.0383 11.5623 15.984L12.6541 15.3164C12.6583 15.3139 12.6631 15.3125 12.668 15.3125C12.6827 15.3125 12.6946 15.3244 12.6946 15.3391V19.6849C12.6946 19.7585 12.7543 19.8182 12.828 19.8182H13.9647Z' fill='currentColor' />
          <path d='M17.2808 19.6676C17.6104 19.8211 17.9873 19.8978 18.4115 19.8978C18.8642 19.8978 19.2591 19.8106 19.5962 19.6364C19.9352 19.4603 20.1985 19.2178 20.386 18.9091C20.5753 18.6004 20.67 18.2462 20.67 17.8466C20.67 17.4773 20.5905 17.1497 20.4314 16.8637C20.2742 16.5777 20.0583 16.3542 19.7837 16.1932C19.511 16.0303 19.2003 15.9489 18.8519 15.9489C18.5772 15.9489 18.332 16.0019 18.1161 16.108C17.9064 16.21 17.7531 16.3393 17.6562 16.4958C17.6524 16.5019 17.6458 16.5057 17.6386 16.5057C17.6265 16.5057 17.6171 16.4953 17.6182 16.4833L17.7379 15.254C17.7445 15.1857 17.8019 15.1336 17.8706 15.1336H20.193C20.2666 15.1336 20.3263 15.0739 20.3263 15.0002V14.1334C20.3263 14.0597 20.2666 14 20.193 14H16.7164C16.6469 14 16.589 14.0534 16.5835 14.1226L16.3501 17.0168C16.3447 17.0848 16.3914 17.1459 16.4585 17.1585L17.4904 17.3522C17.5454 17.3625 17.6001 17.3366 17.6344 17.2923C17.7078 17.1974 17.804 17.1199 17.9229 17.0597C18.0744 16.9839 18.2344 16.947 18.403 16.9489C18.581 16.9489 18.7382 16.9887 18.8746 17.0682C19.0128 17.1459 19.1208 17.2548 19.1985 17.3949C19.278 17.5351 19.3168 17.6989 19.3149 17.8864C19.3168 18.0701 19.2789 18.233 19.2013 18.375C19.1236 18.5152 19.0166 18.6241 18.8803 18.7017C18.7439 18.7794 18.5877 18.8182 18.4115 18.8182C18.1861 18.8182 17.992 18.7538 17.8291 18.625C17.6993 18.5209 17.6177 18.3903 17.5841 18.2333C17.5693 18.1639 17.5122 18.108 17.4413 18.108H16.3404C16.2656 18.108 16.2049 18.1696 16.2119 18.244C16.2393 18.5373 16.3352 18.8007 16.4996 19.0341C16.6909 19.3031 16.9513 19.5142 17.2808 19.6676Z' fill='currentColor' />
        </svg>
      )}
      {time > 0 && (
        <svg viewBox='0 0 32 32' fill='none' aria-hidden='true' xmlns='http://www.w3.org/2000/svg' className='h-6 w-6 opacity-50 duration-300 group-hover:opacity-100 '>
          <path d='M15.3333 10.3452C15.3333 10.8924 15.9561 11.2066 16.3962 10.8814L20.9234 7.5364C21.2841 7.26993 21.2841 6.73054 20.9234 6.46405L16.3962 3.11873C15.9561 2.79356 15.3333 3.10773 15.3333 3.6549V5.22682C15.3333 5.29746 15.2777 5.35579 15.2073 5.36066C9.3179 5.76757 4.66666 10.674 4.66666 16.6667C4.66666 22.9259 9.74076 28 16 28C22.0352 28 26.9686 23.2827 27.314 17.3341C27.3353 16.9665 27.0348 16.6673 26.6666 16.6673H24.6666C24.2984 16.6673 24.0029 16.9668 23.9726 17.3337C23.6336 21.4399 20.1936 24.6667 16 24.6667C11.5817 24.6667 7.99999 21.085 7.99999 16.6667C7.99999 12.5225 11.1517 9.11428 15.1887 8.70739C15.2663 8.69957 15.3333 8.76096 15.3333 8.83893V10.3452Z' fill='currentColor' />
          <path d='M13.9647 19.8182C14.0383 19.8182 14.098 19.7585 14.098 19.6849V14.1334C14.098 14.0597 14.0383 14 13.9647 14H12.8321C12.8072 14 12.7828 14.007 12.7617 14.0201L11.4223 14.8529C11.3832 14.8773 11.3594 14.9201 11.3594 14.9662V15.8702C11.3594 15.9743 11.4734 16.0383 11.5622 15.984L12.6541 15.3164C12.6583 15.3139 12.6631 15.3125 12.668 15.3125C12.6827 15.3125 12.6946 15.3244 12.6946 15.3391V19.6849C12.6946 19.7585 12.7543 19.8182 12.8279 19.8182H13.9647Z' fill='currentColor' />
          <path d='M17.2808 19.6676C17.6104 19.8211 17.9873 19.8978 18.4115 19.8978C18.8641 19.8978 19.259 19.8106 19.5962 19.6364C19.9352 19.4603 20.1984 19.2178 20.3859 18.9091C20.5753 18.6004 20.67 18.2462 20.67 17.8466C20.67 17.4773 20.5905 17.1497 20.4314 16.8637C20.2742 16.5777 20.0583 16.3542 19.7837 16.1932C19.5109 16.0303 19.2003 15.9489 18.8518 15.9489C18.5772 15.9489 18.3319 16.0019 18.116 16.108C17.9064 16.21 17.7531 16.3393 17.6562 16.4958C17.6524 16.5019 17.6457 16.5057 17.6386 16.5057C17.6265 16.5057 17.6171 16.4953 17.6182 16.4833L17.7378 15.254C17.7445 15.1857 17.8019 15.1336 17.8706 15.1336H20.1929C20.2666 15.1336 20.3263 15.0739 20.3263 15.0002V14.1334C20.3263 14.0597 20.2666 14 20.1929 14H16.7163C16.6468 14 16.589 14.0534 16.5834 14.1226L16.3501 17.0168C16.3446 17.0848 16.3914 17.1459 16.4584 17.1585L17.4903 17.3522C17.5454 17.3625 17.6001 17.3366 17.6343 17.2923C17.7078 17.1974 17.804 17.1199 17.9229 17.0597C18.0744 16.9839 18.2344 16.947 18.403 16.9489C18.581 16.9489 18.7382 16.9887 18.8746 17.0682C19.0128 17.1459 19.1208 17.2548 19.1984 17.3949C19.278 17.5351 19.3168 17.6989 19.3149 17.8864C19.3168 18.0701 19.2789 18.233 19.2013 18.375C19.1236 18.5152 19.0166 18.6241 18.8802 18.7017C18.7439 18.7794 18.5876 18.8182 18.4115 18.8182C18.1861 18.8182 17.992 18.7538 17.8291 18.625C17.6993 18.5209 17.6176 18.3903 17.5841 18.2333C17.5692 18.1639 17.5122 18.108 17.4413 18.108H16.3404C16.2656 18.108 16.2049 18.1696 16.2119 18.244C16.2393 18.5373 16.3352 18.8007 16.4996 19.0341C16.6909 19.3031 16.9513 19.5142 17.2808 19.6676Z' fill='currentColor' />
        </svg>
      )}
    </div>
  )
}

export default PlayButton
