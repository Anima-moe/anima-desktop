import { getLocaleMetadata } from '@/services/anima/getMetadataFromMedia'
type Props = {
  episode: Anima.RAW.Episode
}

const beautyNumber = (number: number) => {
  if (number < 10) return `0${number}`
  return number
}

function EpisodeCard({ episode }: Props) {
  return (
    <div className="flex flex-row">
      <div
        className="episde-card h-40 w-72 min-w-[18rem] rounded-md bg-tertiary bg-cover bg-center"
        style={{ backgroundImage: `url('${episode.thumbnail}')` }}
      />
      <div className="ml-4 flex w-full flex-col justify-center">
        <h2 className="mb-2 flex text-lg font-semibold">
          <span className="mr-1.5 flex items-center justify-center rounded-md bg-primary px-2 text-accent">
            {beautyNumber(episode.number) || '?'}
          </span>
          {getLocaleMetadata<Anima.RAW.Episode, Anima.RAW.EpisodeMetadata>(episode)?.title ||
            'Unknown title'}
        </h2>
        <p className="text-sm text-white text-opacity-60 line-clamp-5 group-hover:text-secondary">
          {getLocaleMetadata<Anima.RAW.Episode, Anima.RAW.EpisodeMetadata>(episode)?.synopsis ||
            'Missing synopsis'}
        </p>
      </div>
    </div>
  )
}

export default EpisodeCard
