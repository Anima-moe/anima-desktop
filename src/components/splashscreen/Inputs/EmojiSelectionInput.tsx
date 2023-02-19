import React, { Fragment, useState } from 'react'

import { CaretDown } from 'phosphor-react'

import { Listbox, Transition } from '@headlessui/react'

type Props = {
  options: { value: string; label: string; emoji?: string }[]
  onSelect?: (value: string) => void
}

function EmojiOptionsInput({ onSelect, options, ...props }: Props) {
  const [activeItem, setActiveItem] = useState<(typeof options)[0]>(options[0])

  return (
    <>
      <Listbox
        value={activeItem.value}
        onChange={(d) => {
          setActiveItem(options[options.findIndex((o) => o.value === d)] || options[0])
          onSelect?.(options[options.findIndex((o) => o.value === d)].value || options[0].value)
        }}
      >
        <div className="relative my-1.5 flex w-full items-center justify-start">
          <Listbox.Button className="relative flex w-full flex-row items-center justify-between rounded-md border border-tertiary bg-secondary px-3 py-2.5 text-lg text-white placeholder-shown:text-subtle active:text-white">
            <p className="flex flex-row">
              <span className="font-noto mr-4">{activeItem.emoji}</span>
              {activeItem.label}
            </p>
            <CaretDown className="text-subtle" size={24} />
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute z-10 mt-52 max-h-60 w-full overflow-auto rounded-md bg-tertiary py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {options.map((option, optionIdx) => (
                <Listbox.Option
                  key={optionIdx}
                  className={({ active }) =>
                    `relative mx-1 cursor-default select-none rounded-md py-2 pl-4 pr-4 text-lg duration-200 ${
                      active
                        ? 'bg-accent text-primary'
                        : 'text-white text-opacity-60' + activeItem.value === option.value
                        ? ' bg-accent'
                        : ''
                    }`
                  }
                  value={option.value}
                >
                  {({ selected }) => (
                    <>
                      <span
                        className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}
                      >
                        {option.emoji && <span className="font-noto mr-4">{option.emoji}</span>}
                        {option.label}
                      </span>
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </>
  )
  // return <div className='flex items-center justify-start w-full relative my-1.5'>
  //   <select
  //     className='w-full rounded-md bg-secondary text-lg pl-12 px-3 py-2.5 border border-tertiary active:text-white placeholder-shown:text-subtle text-white'
  //     placeholder={placeholder.label}
  //     onChange={e => setSelectedOption(options.find(option => option.value === e.target.value))}
  //   >
  //     {options.map(option => <option value={option.value} key={option.value}>{option.label}</option>)}
  //   </select>
  //   <div className='absolute left-3 text-xl top-1/2 -translate-y-1/2'>
  //     {selectedOption ? selectedOption.emoji : placeholder.emoji}
  //   </div>
  // </div>
}

export default EmojiOptionsInput
