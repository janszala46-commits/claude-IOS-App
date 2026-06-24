import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'de.vidsave.app',
  appName: 'VidSave',
  webDir: 'dist',
  plugins: {
    StatusBar: {
      style: 'Dark',
      backgroundColor: '#0D0D0F',
    },
    SplashScreen: {
      launchShowDuration: 1000,
      backgroundColor: '#0D0D0F',
      showSpinner: false,
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER_CROP',
    },
  },
}

export default config
