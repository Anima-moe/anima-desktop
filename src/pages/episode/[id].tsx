import React from 'react'
import GeneralLayout from '@/components/Layout/General'
import { Scrollbars } from 'react-custom-scrollbars'

import 'vidstack/styles/base.css'
// the following styles are optional - remove to go headless.
import 'vidstack/styles/ui/buttons.css'
import 'vidstack/styles/ui/sliders.css'

import { AspectRatio, HLSVideo, Media } from '@vidstack/react'
import MediaLayout from '@/components/Layout/Media'
import EpisodeFatCard from '@/components/Episode/EpisodeFatCard'

type Props = {
  episodes: Anima.RAW.Episode[]
}

function Episode({episodes}: Props) {
  return <GeneralLayout>
    <MediaLayout>
      <div className='flex w-[70%]'>
        <Media controls poster="https://media-files.vidstack.io/poster.png" view="video" load='eager' className='justify-center items-center flex'>
            <HLSVideo className='aspect-video w-full rounded-md overflow-hidden'>
              <video src="http://localhost:15411/aHR0cHM6Ly9hcGkucHVyYXkubW9lL2VwaXNvZGlvcy80NTgyNC9tM3U4L21hc3Rlci5tM3U4.m3u8" preload="none" data-video="0" />
            </HLSVideo>
        </Media>
      </div>
      <div className='flex flex-col w-[30%] aspect-[9/11.8] h-full pl-4 overflow-y-hidden'>
        <span className='bg-secondary rounded-md px-4 py-2'>Episodes</span>
        <Scrollbars autoHide hideTracksWhenNotNeeded universal>
          <EpisodeFatCard episode={{
              id: 1,
              EpisodeMetadata: [
                {
                  title: 'Senpai, você é meio... / Senpai, você não fica bravo?',
                  episode_id: 1,
                  locale_key: 'pt-BR',
                  synopsis: 'Nagatoro, uma aluna de primeiro ano, descobre que seu Senpai é um mangaká de mão cheia, e decide lhe dar uma aula de caracterização de personagem. / Nagatoro invade a sala de artes onde o Senpai pratica suas habilidades e o força a fazer um retrato seu.',

                }
              ],
              number: 1,
              season_id: 1,
              source: [
                {
                  external_id: 'a',
                  id: 1,
                  locale_key: 'pt-BR',
                  source_id: 1,
                }
              ],
              source_id: 1
            }} cover='https://www.crunchyroll.com/imgsrv/display/thumbnail/1920x1080/catalog/crunchyroll/5aae52d96baf22d1b4e55296d135a54c.jpe'
          />
          <EpisodeFatCard 
            episode={{
              id: 1,
              EpisodeMetadata: [
                {
                  locale_key: 'pt-BR',
                  title: 'Senpai, seu desejo foi realizado! / E aí, Senpai?!',
                  episode_id: 1,
                  synopsis: 'Nagatoro descobre o tipo de literatura alternativa que o Senpai anda consumindo, e decide experimentar por conta própria. // Senpai acaba vendo Nagatoro em um encontro com outros garotos, e fica à espreita para assistir ao sofrimento deles nas mãos da megera.'
                }
              ],
              number: 2,
              season_id: 1,
              source: [
                {
                  locale_key: 'pt-BR',
                  external_id: 'a',
                  id: 1,
                  source_id: 1,
                }
              ],
              source_id: 1
            }} 
            cover='https://www.crunchyroll.com/imgsrv/display/thumbnail/1920x1080/catalog/crunchyroll/db08edf0440be39b37d8330ff7fdae72.jpe'
            active
          />
          <EpisodeFatCard episode={{
              id: 1,
              EpisodeMetadata: [
                {
                  locale_key: 'pt-BR',
                  title: 'Vamos de novo, Senpai / Senpai, vem cá!',
                  episode_id: 1,
                  synopsis: 'Quando são pegos por uma chuva repentina, Nagatoro convida o Senpai a se abrigar na casa dela até a chuva passar, o que dá a ela inúmeras chances de pegar no pé dele. / Na hora do almoço, Nagatoro chama o Senpai a se sentar à mesa com ela e suas amigas, que não ficam atrás em matéria de implicância.'
                }
              ],
              number: 3,
              season_id: 1,
              source: [
                {
                  locale_key: 'pt-BR',
                  external_id: 'a',
                  id: 1,
                  source_id: 1,
                }
              ],
              source_id: 1
            }} cover='https://www.crunchyroll.com/imgsrv/display/thumbnail/1920x1080/catalog/crunchyroll/1d219877661fad883bb11ac80a46253e.jpe'
          />
          <EpisodeFatCard episode={{
              id: 1,
              EpisodeMetadata: [
                {
                  locale_key: 'pt-BR',
                  title: 'Senpai, seu rosto ficou vermelho? / Senpai, podia ser um pouco mais...',
                  episode_id: 1,
                  synopsis: 'As amigas da Nagatoro decidem pregar uma peça das brabas no pobre Senpai, e Nagatoro não fica nem um pouco contente. / Nagatoro ensina ao Senpai uma importantíssima lição de vida sobre elogios.'
                }
              ],
              number: 4,
              season_id: 1,
              source: [
                {
                  locale_key: 'pt-BR',
                  external_id: 'a',
                  id: 1,
                  source_id: 1,
                }
              ],
              source_id: 1
            }} cover='https://www.crunchyroll.com/imgsrv/display/thumbnail/1920x1080/catalog/crunchyroll/4fb00ca9ec76435fd22e7997de26cc61.jpe'
          />
        </Scrollbars>
      </div>

    </MediaLayout>
  </GeneralLayout>
}

export default Episode