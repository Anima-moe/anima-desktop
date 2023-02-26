export async function createMainWindow() {
  const { WebviewWindow, appWindow } = await import('@tauri-apps/api/window')
  const animaWindow = new WebviewWindow('Anima', {
    fullscreen: false,
    height: 900,
    width: 1600,
    minWidth: 1360,
    minHeight: 720,
    resizable: true,
    title: 'Λ ＮＩＭ Λ - [あーにま • Alpha]',
    visible: false,
    transparent: false,
  })
  animaWindow.once('tauri://created', () => {
    // invoke('close_splashscreen')
    appWindow.close()
  })
  animaWindow.once('tauri://error', () => {
    // TODO: Global error handler
  })
}

export async function createSplashScreen() {
  const { WebviewWindow, appWindow } = await import('@tauri-apps/api/window')
  const animaWindow = new WebviewWindow('main', {
    fullscreen: false,
    maxWidth: 1200,
    maxHeight: 650,
    minWidth: 920,
    minHeight: 500,
    resizable: false,
    url: '/splashscreen',
    title: 'Λ ＮＩＭ Λ - [あーにま • Alpha]',
    visible: false,
    transparent: true,
  })
  animaWindow.once('tauri://created', () => {
    // invoke('close_splashscreen')
    appWindow.close()
  })
  animaWindow.once('tauri://error', () => {
    // TODO: Global error handler
  })
}
