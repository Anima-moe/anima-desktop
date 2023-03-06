import { useEffect, useState } from 'react'

import { useAtom } from 'jotai'

import { userPreferedVolume } from '@/stores/atoms'
import {  MediaSliderValue, MediaVolumeSlider, useMediaPlayer, useMediaRemote, useMediaStore } from '@vidstack/react'

import 'vidstack/styles/base.css'

const VolumeBar: React.FunctionComponent = () => {
  const [userVolume, setUserVolume] = useAtom(userPreferedVolume)
  const mediaRemote = useMediaRemote()
  const mediaPlayer = useMediaPlayer()
  const { volume, muted } = useMediaStore()

  useEffect(()=>{
    if (!mediaPlayer) { return }

    mediaPlayer.addEventListener('loaded-metadata', ()=>{
      if (userVolume) {
        mediaRemote.changeVolume(parseFloat(userVolume))
      }
    }, { once: true })
  }, [mediaPlayer])


  return <div className='flex items-center justify-center pointer-events-auto overflow-visible gap-2'>
    {/* VOLUME LOW */}
    <div 
      className='hover:bg-primary px-2 py-2 rounded-md cursor-pointer hover:opacity-100 opacity-60'
      onClick={()=>{mediaRemote.toggleMuted()}}
    >
      <svg 
        viewBox='0 0 32 32' 
        fill='none'  
        xmlns='http://www.w3.org/2000/svg' 
        className='w-6 h-6' 
        style={{display: volume >= 0.5 ? 'none' : muted ? 'none' : 'block'}}
      >
        <path d='M17.5091 24.6594C17.5091 25.2066 16.8864 25.5207 16.4463 25.1956L9.44847 20.0252C9.42553 20.0083 9.39776 19.9991 9.36923 19.9991H4.66667C4.29848 19.9991 4 19.7006 4 19.3324V12.6658C4 12.2976 4.29848 11.9991 4.66667 11.9991H9.37115C9.39967 11.9991 9.42745 11.99 9.45039 11.973L16.4463 6.80358C16.8863 6.4784 17.5091 6.79258 17.5091 7.33975L17.5091 24.6594Z' fill='currentColor' />
        <path d='M22.8424 12.6667C22.8424 12.2985 22.544 12 22.1758 12H20.8424C20.4743 12 20.1758 12.2985 20.1758 12.6667V19.3333C20.1758 19.7015 20.4743 20 20.8424 20H22.1758C22.544 20 22.8424 19.7015 22.8424 19.3333V12.6667Z' fill='currentColor' />
      </svg>
      {/* VOLUME HIGH */}
      <svg 
        viewBox="0 0 32 32" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg" 
        className='w-6 h-6' 
        style={{display: volume < 0.5 ? 'none' : muted ? 'none' : 'block'}}
      >
        <path d="M17.5091 24.6595C17.5091 25.2066 16.8864 25.5208 16.4463 25.1956L9.44847 20.0252C9.42553 20.0083 9.39776 19.9992 9.36923 19.9992H4.66667C4.29848 19.9992 4 19.7007 4 19.3325V12.6658C4 12.2976 4.29848 11.9992 4.66667 11.9992H9.37115C9.39967 11.9992 9.42745 11.99 9.45039 11.9731L16.4463 6.80363C16.8863 6.47845 17.5091 6.79262 17.5091 7.3398L17.5091 24.6595Z" fill="currentColor" />
        <path d="M27.5091 9.33336C27.8773 9.33336 28.1758 9.63184 28.1758 10V22C28.1758 22.3682 27.8773 22.6667 27.5091 22.6667H26.1758C25.8076 22.6667 25.5091 22.3682 25.5091 22V10C25.5091 9.63184 25.8076 9.33336 26.1758 9.33336L27.5091 9.33336Z" fill="currentColor" />
        <path d="M22.1758 12C22.544 12 22.8424 12.2985 22.8424 12.6667V19.3334C22.8424 19.7016 22.544 20 22.1758 20H20.8424C20.4743 20 20.1758 19.7016 20.1758 19.3334V12.6667C20.1758 12.2985 20.4743 12 20.8424 12H22.1758Z" fill="currentColor" />
      </svg>
      {/* MUTED */}
      <svg
        viewBox="0 0 32 32" 
        fill="none" 
        aria-hidden="true" 
        xmlns="http://www.w3.org/2000/svg"
        className='w-6 h-6' 
        style={{display: !muted ? 'none' : 'block'}}
      >
        <path d="M17.5091 24.6594C17.5091 25.2066 16.8864 25.5208 16.4463 25.1956L9.44847 20.0252C9.42553 20.0083 9.39776 19.9991 9.36923 19.9991H4.66667C4.29848 19.9991 4 19.7006 4 19.3325V12.6658C4 12.2976 4.29848 11.9991 4.66667 11.9991H9.37115C9.39967 11.9991 9.42745 11.99 9.45039 11.973L16.4463 6.8036C16.8863 6.47842 17.5091 6.79259 17.5091 7.33977L17.5091 24.6594Z" fill="currentColor" />
        <path d="M28.8621 13.6422C29.1225 13.3818 29.1225 12.9597 28.8621 12.6994L27.9193 11.7566C27.659 11.4962 27.2368 11.4962 26.9765 11.7566L24.7134 14.0197C24.6613 14.0717 24.5769 14.0717 24.5248 14.0197L22.262 11.7568C22.0016 11.4964 21.5795 11.4964 21.3191 11.7568L20.3763 12.6996C20.116 12.9599 20.116 13.382 20.3763 13.6424L22.6392 15.9053C22.6913 15.9573 22.6913 16.0418 22.6392 16.0938L20.3768 18.3562C20.1165 18.6166 20.1165 19.0387 20.3768 19.299L21.3196 20.2419C21.58 20.5022 22.0021 20.5022 22.2624 20.2418L24.5248 17.9795C24.5769 17.9274 24.6613 17.9274 24.7134 17.9795L26.976 20.2421C27.2363 20.5024 27.6585 20.5024 27.9188 20.2421L28.8616 19.2992C29.122 19.0389 29.122 18.6168 28.8616 18.3564L26.599 16.0938C26.547 16.0418 26.547 15.9573 26.599 15.9053L28.8621 13.6422Z" fill="currentColor" />
      </svg>
    </div>
    <MediaVolumeSlider 
      className='w-24 h-2 overflow-visible flex items-center text-xs gap-2 group'
      onClick={()=>{
        setUserVolume(volume.toString())
      }}
    >
      <div className='w-full h-1 bg-white/30 group-hover:h-2 duration-100 transition-[height] rounded overflow-hidden'>
        <div className='bg-accent w-[var(--slider-fill-percent)] h-full rounded' />
      </div>
      <MediaSliderValue type="pointer" format="percent" className='absolute px-2 py-1 bg-secondary rounded-md left-[var(--slider-pointer-percent)] -translate-y-full -translate-x-1/2 opacity-0 transition-opacity duration-200 ease-out group-data-[interactive]:opacity-100 group-data-[interactive]:ease-in shadow-lg font-semibold pointer-events-none' />
    </MediaVolumeSlider>
  </div>
}

export default VolumeBar
