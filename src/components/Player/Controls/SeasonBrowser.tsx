// import { Popover, Transition } from "@headlessui/react"
import { ArrowDown, BookOpen, MonitorPlay } from "phosphor-react"
import EpisodeFatCard from "@/components/Episode/EpisodeFatCard"
import Scrollbars from 'react-custom-scrollbars'
import { useTranslation } from 'react-i18next'
import { useAtom } from "jotai"
import { playerStreamConfig } from '@/stores/atoms'
import * as Popover from '@radix-ui/react-popover'
import { AnimatePresence, motion } from 'framer-motion'

type Props = {
  season: Anima.RAW.Season
  episode: Anima.RAW.Episode
}

export default function SeasonBrowser({season, episode}: Props) {
  const { t } = useTranslation()

//   return <Popover className="relative pointer-events-auto ml-auto">
//     {({ open }) => (
//       <>
//         <Popover.Button 
//           className={`
//           cursor-pointer border hover:text-accent hover:bg-black duration-300 px-3 py-3 rounded-md
//           ${open ? 'bg-accent text-primary border-accent' : 'bg-transparent border-transparent text-white'}`}
//         >
//           <MonitorPlay weight="fill" size={24} />
//         </Popover.Button>
//         <Transition
//           enter="transition duration-300 ease-out"
//           enterFrom="transform opacity-0 -translate-y-6"
//           enterTo="transform opacity-300"
//           leave="transition ease-out"
//           leaveFrom="transform scale-300 opacity-100"
//           leaveTo="transform  opacity-0"
//         >
//           <Popover.Panel className="absolute mt-4 -translate-x-[21rem] h-96 w-96 rounded-md p-2 bg-secondary aspect-video overflow-hidden">
//             <div className="w-full h-full flex overflow-hidden flex-col rounded-md">
//               <h3 className="text-xs my-1 mb-2 px-1.5 font-semibold">{t('anime_generic_season', {n: season.number})} • {season.title}</h3>
//               <Scrollbars>
//                   {season.AnimeEpisode.sort((a,b) => a.number-b.number).map((seasonEpisode, index) => {
//                     return <EpisodeFatCard link={`/episode/${seasonEpisode.id}?seasonid=${season.id}`} episode={seasonEpisode} active={seasonEpisode.id === episode.id} key={`${episode.id}.${episode.number}.${index}`}/>
//                   })}
//               </Scrollbars>
//             </div>
//           </Popover.Panel>
//         </Transition>
//       </>
//     )}
// </Popover>
  return <Popover.Root>
      <Popover.Trigger asChild>
        <button 
          className={`
            cursor-pointer border hover:bg-black duration-300 px-3 py-3 rounded-md ml-auto
            bg-transparent hover:text-accent pointer-events-auto border-transparent text-white
          `}
        >
           <MonitorPlay weight="fill" size={24} />
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content className="bg-secondary rounded-md pt-2 px-2 transition-[height] w-max h-max border border-tertiary max-w-[20rem] relative 'overflow-hidden text-subtle whitespace-nowrap text-ellipsis overflow-hidden" sideOffset={1}>
          {/* <h3 className="text-xs my-1 mb-2 px-1.5 font-semibold">{t('anime_generic_season', {n: season.number})} • {season.title}</h3> */}
          <div className="pb-4 px-2 flex items-center text-ellipsis overflow-hidden w-3/4">
              <BookOpen weight="fill" size={16} className='mr-1.5 '/> {t('anime_generic_season', {n: season.number})}
          </div>
          <div className="w-full flex max-h-[calc(100vh-16rem)] overflow-scroll flex-col text-white pt-2 -mt-2">
              {season.AnimeEpisode.sort((a,b) => a.number-b.number).map((seasonEpisode, index) => {
                return <EpisodeFatCard link={`/episode/${seasonEpisode.id}?seasonid=${season.id}`} episode={seasonEpisode} active={seasonEpisode.id === episode.id} key={`${episode.id}.${episode.number}.${index}`}/>
              })}
          </div>  
          <Popover.Arrow className="fill-secondary stroke-tertiary stroke-2" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
}