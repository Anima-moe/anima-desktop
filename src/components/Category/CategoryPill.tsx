import { getLocaleMetadata } from '@/services/anima/getMetadataFromMedia'
import React from 'react'

type Props = {
  selected?: boolean
  onClick?: () => void
  category: Anima.RAW.Category
}

function CategoryPill({selected, category, onClick}: Props) {
  return (
    <div  
      className={`
        flex flex-row items-center justify-between px-4 py-2 cursor-pointer rounded-md mb-2 mr-2 group text-subtle select-none
        ${selected ? 'bg-accent text-primary font-semibold hover:bg-black hover:text-accent' : 'bg-secondary hover:bg-accent hover:text-primary'}`
      }
      onClick={onClick}
    >
      {getLocaleMetadata<Anima.RAW.Category, Anima.RAW.CategoryMetadata>(category).title}
    </div>
  )
}

export default CategoryPill