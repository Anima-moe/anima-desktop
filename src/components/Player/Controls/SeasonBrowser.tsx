import { Popover, Transition } from "@headlessui/react"
import { ArrowDown, MonitorPlay } from "phosphor-react"
import EpisodeFatCard from "@/components/Episode/EpisodeFatCard"
import Scrollbars from 'react-custom-scrollbars'
import { useTranslation } from 'react-i18next';


type Props = {
  season: Anima.RAW.Season
  episode: Anima.RAW.Episode
}

export default function SeasonBrowser({season, episode}: Props) {
  const { t } = useTranslation()

  return <Popover className="relative pointer-events-auto ml-auto">
    {({ open }) => (
      <>
        <Popover.Button 
          className={`
          cursor-pointer border hover:text-accent hover:bg-black duration-300 px-3 py-3 rounded-md
          ${open ? 'bg-accent text-primary border-accent' : 'bg-transparent border-transparent text-white'}`}
        >
          <MonitorPlay weight="fill" size={24} />
        </Popover.Button>
        <Transition
          enter="transition duration-300 ease-out"
          enterFrom="transform opacity-0 -translate-y-6"
          enterTo="transform opacity-300"
          leave="transition ease-out"
          leaveFrom="transform scale-300 opacity-100"
          leaveTo="transform  opacity-0"
        >
          <Popover.Panel className="absolute mt-4 -translate-x-[21rem] h-96 w-96 rounded-md p-2 bg-secondary aspect-video overflow-hidden">
            <div className="w-full h-full flex overflow-hidden flex-col rounded-md">
              <h3 className="text-xs my-1 mb-2 px-1.5 font-semibold">{t('anime_generic_season', {n: season.number})} • {season.title}</h3>
              <Scrollbars>
                  {season.AnimeEpisode.sort((a,b) => a.number-b.number).map((seasonEpisode, index) => {
                    return <EpisodeFatCard link={`/episode/${seasonEpisode.id}?seasonid=${season.id}`} episode={seasonEpisode} active={seasonEpisode.id === episode.id} key={`${episode.id}.${episode.number}.${index}`}/>
                  })}
              </Scrollbars>
            </div>
          </Popover.Panel>
        </Transition>
      </>
    )}
</Popover>
}