import { useState } from "react"
import GeneralLayout from '@/components/Layout/General'
import AnimeHero from "../components/Anime/AnimeHero"

function App() {
  const [greetMsg, setGreetMsg] = useState("")
  const [name, setName] = useState("")

  return <GeneralLayout fluid>
    <AnimeHero anime={{
      background: 'https://64.media.tumblr.com/47c4c55d145d06345b6ead8965805379/0c5a054892d75f30-e2/s540x810/8b4fe1ad19e63c9559f40cf82ff0979529368999.gifv',
      cover: 'https://www.crunchyroll.com/imgsrv/display/thumbnail/1560x2340/catalog/crunchyroll/d48d4a62b0ac6381c87bd040b69b0a89.jpe',
      external_id: '',
      metadata: {
        'pt-BR': {
          anime_id: 1,
          id: 1,
          locale_key: 'pt-BR',
          synopsis: 'teste',
          title: 'Teste',
          type: 'anime'
        },
        'en-US': {
          anime_id: 1,
          id: 1,
          locale_key: 'pt-BR',
          synopsis: 'Japão, era Taisho. Tanjiro, um bondoso jovem que ganha a vida vendendo carvão, descobre que sua família foi massacrada por um demônio. E pra piorar, Nezuko, sua irmã mais nova e única sobrevivente, também foi transformada num demônio. Arrasado com esta sombria realidade, Tanjiro decide se tornar um matador de demônios para fazer sua irmã voltar a ser humana, e para matar o demônio que matou sua família. Um triste conto sobre dois irmãos, onde os destinos dos humanos e dos demônios se entrelaçam, começa agora.',
          title: 'Demon Slayer: Kimetsu no Yaiba',
          type: 'anime'
        }
      },
      seasons: [],
      slug: 'teste'
    }} />
    aaaaaaa
  </GeneralLayout>
}

export default App
