import { Popover } from "@headlessui/react"
import { ArrowDown } from "phosphor-react"

type Props = {
  season: Anima.RAW.Season
  episode: Anima.RAW.Episode
}

export default function SeasonBrowser({season, episode}: Props) {
  return <Popover className="relative cursor-pointer pointer-events-auto w-full bg-red-600">
  <Popover.Button className='ml-auto bg-blue-400'>Solutions</Popover.Button>

  <Popover.Panel className="absolute z-10">
    <div className="grid grid-cols-2">
      <a href="/analytics">Analytics</a>
      <a href="/engagement">Engagement</a>
      <a href="/security">Security</a>
      <a href="/integrations">Integrations</a>
    </div>

    <img src="/solutions.jpg" alt="" />
  </Popover.Panel>
</Popover>
}