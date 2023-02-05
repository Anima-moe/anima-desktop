import { MediaPlayerElement } from 'vidstack';

interface DecoderOptions { subtitleURL?: string, videoElement?: HTMLVideoElement, canvasElement?: HTMLCanvasElement, playerElement: MediaPlayerElement }

function isFirefox() {
  return navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
}

function getFileExtension(file) {
  return file.split('.').pop();
}

//    _    ______________
//   | |  / /_  __/_  __/
//   | | / / / /   / /   
//  _| |/ / / /   / /    
// (_)___/ /_/   /_/     
async function encodeVideoTextTrack(options: DecoderOptions) {
  if (!options.subtitleURL) return;
  if (!options.videoElement) return;

  const track = document.createElement('track');
  track.src = options.subtitleURL;

  options.videoElement.appendChild(track);

  if (localStorage.getItem('puray.showSubs') === 'true') {
    options.videoElement.textTracks[0].mode = "showing";
  }

  window.addEventListener('toggleSubtitle', (e: any) => {
    if (e.detail.state) {
      options.videoElement.textTracks[0].mode = "showing";
    } else {
      options.videoElement.textTracks[0].mode = "hidden";
    }
  })
}

//                 __ 
//      __________/ /_
//     / ___/ ___/ __/
//  _ (__  ) /  / /_  
// (_)____/_/   \__/  
async function encodeSubRip(options: DecoderOptions) {
  if (!options.subtitleURL) return;
  if (!options.videoElement) return;

  const subText = await fetch(options.subtitleURL).then(res => res.text());
  const track = document.createElement('track');

  track.src = await srtToWebVTT(subText);
  options.videoElement.appendChild(track);

  if (localStorage.getItem('puray.showSubs') === 'true') {
    options.videoElement.textTracks[0].mode = "showing";
  }

  window.addEventListener('toggleSubtitle', (e: any) => {
    if (e.detail.state) {
      options.videoElement.textTracks[0].mode = "showing";
    } else {
      options.videoElement.textTracks[0].mode = "hidden";
    }
  })

}

const subtitleToURL = (text: string): string => URL
  .createObjectURL(new Blob([text], { type: 'text/vtt' }))

const srtToVTT = (utf8str: string) => utf8str
  .replace(/\{\\([ibu])\}/g, '</$1>')
  .replace(/\{\\([ibu])1\}/g, '<$1>')
  .replace(/\{([ibu])\}/g, '<$1>')
  .replace(/\{\/([ibu])\}/g, '</$1>')
  .replace(/(\d\d:\d\d:\d\d),(\d\d\d)/g, '$1.$2')
  .concat('\r\n\r\n')

const srtToWebVTT = async (vrtSource: string): Promise<string> => {
  if (!(FileReader)) {
    throw (new Error(`SRT -> VTT: No FileReader constructor found`));
  }
  if (!TextDecoder) {
    throw (new Error(`SRT -> VTT: No TextDecoder constructor found`));
  }

  const vttString = 'WEBVTT FILE\r\n\r\n'; // leading text
  let text = vttString.concat(srtToVTT(vrtSource));
  return Promise.resolve(subtitleToURL(text));
};


//     ____ ___________
//    / __ `/ ___/ ___/
//  _/ /_/ (__  |__  ) 
// (_)__,_/____/____/                             

async function encodeSubStationAlpha(options: DecoderOptions) {

  const JASSUB = await import('jassub')

  const renderer = new JASSUB.default({
    video: options.videoElement,
    // canvas: options.canvasElement,
    subUrl: options.subtitleURL,
    workerUrl: '/s/jassub-worker.js',
    // offscreenRender: !isFirefox()
  })


  // if (localStorage.getItem('puray.showSubs') === 'false') {
  //   renderer.freeTrack()
  // }

  // window.addEventListener('toggleSubtitle', (e: any) => {
  //   if (e.detail.state) {
  return renderer
  //   } else {
  //     renderer.freeTrack()
  //   }
  // })

}

//   ___  ____  _________  ____/ /__  _____   ________  / /__  _____/ /_____  _____
//  / _ \/ __ \/ ___/ __ \/ __  / _ \/ ___/  / ___/ _ \/ / _ \/ ___/ __/ __ \/ ___/
// /  __/ / / / /__/ /_/ / /_/ /  __/ /     (__  )  __/ /  __/ /__/ /_/ /_/ / /    
// \___/_/ /_/\___/\____/\__,_/\___/_/     /____/\___/_/\___/\___/\__/\____/_/     

async function encodeSubtitle(options: DecoderOptions) {
  if (!options.subtitleURL || options.subtitleURL === '') return;
  if (!options.videoElement && !options.canvasElement) return;


  // options.playerElement.addEventListener('can-play', () => {
  switch (getFileExtension(options.subtitleURL)) {
    case "vtt": {
      return await encodeVideoTextTrack(options);
    }
    case "srt": {
      return await encodeSubRip(options)
    }
    case "ass": {
      return await encodeSubStationAlpha(options);
    }
    default: {
      return await encodeSubStationAlpha(options);
    }
  }
  // }, { once: true });

}

export default encodeSubtitle