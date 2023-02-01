import { Popover, Transition } from '@headlessui/react'
import { Gear } from 'phosphor-react'

type Props = {}

function index({}: Props) {
  return <Popover className="relative pointer-events-auto">
    {({ open }) => (
      <>
        <Popover.Button 
          className={`
          cursor-pointer ml-4 border hover:text-accent hover:bg-black duration-300 px-3 py-3 rounded-md
          ${open ? 'bg-accent text-primary border-black' : 'bg-transparent border-transparent text-white'}`}
        >
          <Gear weight="fill" size={24} />
        </Popover.Button>
        <Transition
          enter="transition duration-300 ease-out"
          enterFrom="transform opacity-0 -translate-y-6"
          enterTo="transform opacity-300"
          leave="transition ease-out"
          leaveFrom="transform scale-300 opacity-100"
          leaveTo="transform  opacity-0"
        >
          <Popover.Panel className="absolute mt-4 -translate-x-[20rem] h-96 w-96 rounded-md p-2 bg-primary aspect-video overflow-hidden pb-8">
             Hello
          </Popover.Panel>
        </Transition>
      </>
    )}
  </Popover>
}

export default index