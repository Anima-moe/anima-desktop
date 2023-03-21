import clsx from 'clsx'

import { getLocaleMetadata } from '@/services/anima/getMetadataFromMedia'

type Props = {
  selected?: boolean
  onClick?: () => void
  category: Anima.RAW.Category
}

function CategoryPill({ selected, category, onClick }: Props) {
  console.log(category)
  return (
    <div
      className={clsx(
        'group mb-2 mr-2 flex cursor-pointer select-none flex-row items-center justify-between rounded-md px-4 py-2 text-subtle',
        selected
          ? 'bg-accent font-semibold text-primary hover:bg-black hover:text-accent'
          : 'bg-secondary hover:bg-accent hover:text-primary'
      )}
      onClick={onClick}
    >
      {getLocaleMetadata<Anima.RAW.Category, Anima.RAW.CategoryMetadata>(category)?.title || category.slug}
    </div>
  )
}

export default CategoryPill
