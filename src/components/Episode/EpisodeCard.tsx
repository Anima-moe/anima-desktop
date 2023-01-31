import { getLocaleMetadata } from '@/services/anima/getMetadataFromMedia';
type Props = {
  episode: Anima.RAW.Episode
}

const beautyNumber = (number: number) => {
  if (number < 10) return `0${number}`
  return number
}

function EpisodeCard({episode}: Props) {
  console.log(episode)
  return <div className='flex flex-row'>
    <div className='h-40 w-72 min-w-[18rem] bg-cover bg-center rounded-md bg-tertiary' style={{backgroundImage: `url('${episode.thumbnail}')`}}/>
    <div className='flex flex-col ml-4 w-full justify-center'>
      <h2 className='text-lg font-semibold flex mb-2'>
        <span className='bg-primary text-accent px-2 rounded-md mr-1.5 flex items-center justify-center'>
          {beautyNumber(episode.number) || '?'}
        </span>
        {getLocaleMetadata<Anima.RAW.Episode, Anima.RAW.EpisodeMetadata>(episode)?.title || 'Unknown title'}
      </h2>
      <p className='text-sm text-white text-opacity-60 line-clamp-5 group-hover:text-secondary'>
        {getLocaleMetadata<Anima.RAW.Episode, Anima.RAW.EpisodeMetadata>(episode)?.synopsis || 'Missing synopsis'}
      </p>
    </div>
  </div>
}

export default EpisodeCard