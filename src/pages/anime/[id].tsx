import { useRouter } from 'next/router'
import React from 'react'
import GeneralLayout from '@/components/Layout/General'
import AnimeCard from '@/components/Anime/AnimeCard'

import { UnmountClosed } from 'react-collapse'
import Season from '@/components/Anime/Season'

type Props = {}

function Anime({}: Props) {
  const router = useRouter()
  const { id } = router.query

  return <GeneralLayout fluid> 
    <div 
      className='w-full h-[50vh] bg-center bg-cover bg-no-repeat relative -mt-16' 
      style={{backgroundImage: `url('https://s4.anilist.co/file/anilistcdn/media/anime/banner/120697-EuMfBYXLANeS.jpg')`}}
    >
      <div className='w-full h-full absolute top-0 left-0 bg-secondary mix-blend-multiply bg-opacity-80' />
    </div>
    <div className='w-full flex flex-row -mt-[20vh] z-[1] px-8'>
      <div className='w-1/5 mr-4'>
        <AnimeCard disabled noHover anime={{
            background: 'https://s4.anilist.co/file/anilistcdn/media/anime/banner/120697-EuMfBYXLANeS.jpg',
            slug: 'dont_toy_with_me_miss_nagatoro',
            cover: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx120697-72Sf22C9PTQn.jpg',
            external_id: '123',
            metadata: {
              'en-US': {
                anime_id: 1,
                title: 'DON\'T TOY WITH ME, MISS NAGATORO',
                id: 1,
                locale_key: 'en-US',
                synopsis: `One day, Senpai visits the library after school and becomes the target of a super sadistic junior! The name of the girl who teases, torments, and tantalizes Senpai is "Nagatoro!" She's annoying yet adorable. It's painful, but you still want to be by her side. This is a story about an extremely sadistic and temperamental girl and you'll feel something awaken inside of you. `,
                type: 'anime'
              }
            },
            seasons: [
              {
                anime_id: 1,
                id: 1,
                number: 1,
                title: 'Season 1'
              }
            ]
          }} 
        />
      </div>
      <div className='ml-4 w-4/5 flex flex-col'>
        {/* TITLE METADATA */}
        <div className='w-full h-[20vh] items-start justify-end flex flex-col overflow-hidden pb-4'>
          <h6 className='text-xs text-white text-opacity-40'>2023</h6>
          <h1 className='text-4xl font-bold'>Don’t Toy with me, miss nagatoro</h1>
          <h3 className='text-lg'>イジらないで、長瀞さん</h3>
        </div>
        {/* SYNOPSIS */}
        <div className='mt-4 w-1/2'>
          <p className='text-sm text-white text-opacity-70'>
            “Uma garota mais nova que eu me fez chorar!“ Certo dia, ao visitar a biblioteca do colégio, Senpai vira o alvo de uma novata super-sádica! O nome da garota que provoca, atormenta e bulina o Senpai é Nagatoro! Ela é pentelha, mas adorável. Estar ao lado dela é agonizante, mas irresistível. Esta é a história de uma garota extremamente sádica e temperamental que vai despertar algo dentro de você. 
          </p>
        </div>
        {/* SEASONS */}
        <div className='w-full mt-4'>
            <Season />
        </div>
      </div>
    </div>
  </GeneralLayout>
}

export default Anime