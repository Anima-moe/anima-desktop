import { useEffect, useState } from 'react'

import General from '@/components/Layout/General'
import { getTauriVersion, getVersion } from '@tauri-apps/api/app'

const donators = [
  '{Ferreira}',
  '/Vitor/',
  'Adinho',
  'angelo 2000',
  'Anti',
  'ArmadoBatista',
  'ArturPortella',
  'Bl4d3z',
  'BXF CauãX',
  'dailyvixens',
  'Danield',
  'deivinni',
  'fate',
  'Fernando',
  'G1rin0',
  'heldi',
  'Iure',
  'Jefferson7n Filipe',
  'Kuriboh',
  'Leo0six',
  'Luckzera',
  'Marcelinho',
  'Martheustorezin',
  'Midaz',
  'mp3',
  'Nag',
  'Nesi',
  'oxy',
  'pato.',
  'peekaboo',
  'sergio cajuela',
  'Skalin151',
  'sueco',
  'tmztal786',
  'vnxcius',
  'YuriCPS',
  'Yuussuke'
]

function shuffleArray(array) {
  let shuffledArray = array

  for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      const temp = shuffledArray[i]
      shuffledArray[i] = shuffledArray[j]
      shuffledArray[j] = temp
  }

  return shuffledArray
}

const StatusDisplay: React.FunctionComponent<{ value: string | number, property: string}> = (props) => {
  return <div className='flex flex-col gap-1.5'>
    <span className='text-xs text-subtle'>{props.property}</span>
    <span className='font-medium whitespace-pre'>{props.value}</span>
  </div>
}

const AboutPage: React.FunctionComponent = (props) => {
  const [currentVersion, setCurrentVersion] = useState('')
  const [currentTauriVersion, setCurrentTauriVersion] = useState('')

  useEffect(() => {
    getVersion().then((version) => {
      setCurrentVersion(version)
    })
    getTauriVersion().then((version) => {
      setCurrentTauriVersion(version)
    })
  }, [])

  return <General>
    <div className='flex flex-col w-full gap-6'>
      <div className='flex flex-col items-center justify-center w-full bg-contain bg-center bg-no-repeat bg-[url(/i/updatebanner.png)] h-96 mt-20 rounded-md relative text-white'>
        {Array.from(Array(20).keys()).map((_, i)=>{
          return <div 
          className='flex w-full text-lg font-bold whitespace-nowrap text-primary mix-blend-luminosity text-slider-animation z-[1]' 
          key={i}>
            { shuffleArray(donators).join(' & ').repeat(100)}
        </div>
        })}
        <div className='w-full h-full absolute inset-0 flex bg-contain bg-[url(/i/updatebanner_f.png)] bg-no-repeat bg-center z-[2]' />
      </div>
      <div className='w-full z-[2] flex flex-col gap-2'>
        {/* <h1 className='text-xl font-semibold uppercase'>A B O U T - Λ ＮＩＭ Λ</h1> */}
        <div className='flex flex-col w-full gap-4 p-4 rounded-md bg-secondary'>
          <StatusDisplay property='Codename' value='Snarky Punch' />
          <StatusDisplay property='Anima Version' value={currentVersion} />
          <StatusDisplay property='Framework Version' value={currentTauriVersion} />
          <StatusDisplay property='Code Contributors' value={['nesi#0110 & Fernando#0383 (Puray.moe Team)', '!flov2#7704'].join('\n')} />
          <StatusDisplay property='Early Contributors' value={shuffleArray(donators).join('\n')} />
        </div>
      </div>
    </div>
  </General>
}

export default AboutPage
